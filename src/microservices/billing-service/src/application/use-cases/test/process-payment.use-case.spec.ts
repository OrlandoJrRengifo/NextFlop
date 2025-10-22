import { BadRequestException } from "@nestjs/common";
import { ProcessPaymentUseCase } from "../payments/process-payment.use-case";
import { PaymentStatus } from "../../../domain/entities/payment.entity";

describe("ProcessPaymentUseCase", () => {
  const userId = "user-1";
  const subscriptionId = "sub-1";

  function makeUseCaseMocks() {
    const repo: any = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    };
    const stripeService: any = {}; 
    const externalApiService: any = {}; 
    return { repo, stripeService, externalApiService };
  }

  it("success: should create payment, update to SUCCEEDED and return updated payment", async () => {
    const { repo, stripeService, externalApiService } = makeUseCaseMocks();
    const originalAmount = 100;
    const pointsToRedeem = 20;
    const finalAmount = Math.max(0, originalAmount - pointsToRedeem);

    const saved = {
      id: "pay-1",
      userId,
      subscriptionId,
      originalAmount,
      finalAmount,
      pointsRedeemed: pointsToRedeem,
      pointsGained: 0,
      status: PaymentStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = {
      ...saved,
      pointsGained: 100,
      status: PaymentStatus.SUCCEEDED,
      updatedAt: new Date(),
    };

    repo.create.mockResolvedValue(saved);
    repo.update.mockResolvedValue(updated);

    const uc = new ProcessPaymentUseCase(repo, stripeService, externalApiService);
    const result = await uc.execute(userId, subscriptionId, originalAmount, pointsToRedeem);

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      userId,
      subscriptionId,
      originalAmount,
      finalAmount,
      pointsRedeemed: pointsToRedeem,
    }));

    expect(repo.update).toHaveBeenCalledWith(saved.id, expect.objectContaining({
      status: PaymentStatus.SUCCEEDED,
      pointsGained: expect.any(Number),
    }));

    expect(result).toEqual(updated);
  });

  it("failure: when update to SUCCEEDED throws, should mark FAILED and throw BadRequestException", async () => {
    const { repo, stripeService, externalApiService } = makeUseCaseMocks();
    const originalAmount = 50;
    const pointsToRedeem = 0;
    const finalAmount = originalAmount;

    const saved = {
      id: "pay-2",
      userId,
      subscriptionId,
      originalAmount,
      finalAmount,
      pointsRedeemed: 0,
      pointsGained: 0,
      status: PaymentStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const failedUpdated = {
      ...saved,
      status: PaymentStatus.FAILED,
      failureDetails: { message: "gateway down" },
      updatedAt: new Date(),
    };

    repo.create.mockResolvedValue(saved);

    // primera llamada a update (intento de marcar succeeded) lanza error
    // segunda llamada (en el catch) debe resolverse marcando failed
    repo.update
      .mockImplementationOnce(() => { throw new Error("gateway down"); })
      .mockResolvedValueOnce(failedUpdated);

    const uc = new ProcessPaymentUseCase(repo, stripeService, externalApiService);

    await expect(uc.execute(userId, subscriptionId, originalAmount, pointsToRedeem))
      .rejects
      .toThrow(BadRequestException);

    // verificamos que se intento marcar succeeded y luego failed
    expect(repo.update).toHaveBeenCalled();
    expect(repo.update.mock.calls[0][1]).toMatchObject({ status: PaymentStatus.SUCCEEDED });
    expect(repo.update.mock.calls[1][1]).toMatchObject({
      status: PaymentStatus.FAILED,
      failureDetails: expect.objectContaining({ message: "gateway down" }),
    });
  });
});
