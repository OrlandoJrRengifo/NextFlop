import { BadRequestException } from "@nestjs/common";
import { ProcessPaymentUseCase } from "../payments/process-payment.use-case";
import { PaymentStatus } from "../../../domain/entities/payment.entity";

describe("ProcessPaymentUseCase", () => {
  function makeMocks() {
    return {
      repo: { create: jest.fn(), update: jest.fn() },
    };
  }

  const baseDto = {
    userId: "user-1",
    subscriptionId: "sub-1",
    originalAmount: 100,
    pointsToRedeem: 20,
    cardNumber: "4242424242424242",
    expiration: "12/27",
    cvv: "123",
    nameOnCard: "John Doe",
  };

  it("successfully processes a payment", async () => {
    const { repo } = makeMocks();

    const saved = {
      id: "pay-1",
      ...baseDto,
      finalAmount: 80,
      pointsGained: 0,
      status: PaymentStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = {
      ...saved,
      pointsGained: 100,
      status: PaymentStatus.SUCCEEDED,
    };

    repo.create.mockResolvedValue(saved);
    repo.update.mockResolvedValue(updated);

    const uc = new ProcessPaymentUseCase(repo as any);

    const result = await uc.execute(baseDto);

    expect(result.status).toBe(PaymentStatus.SUCCEEDED);
  });

  it("marks FAILED if update fails", async () => {
    const { repo } = makeMocks();

    const saved = {
      id: "pay-2",
      ...baseDto,
      finalAmount: 80,
      status: PaymentStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repo.create.mockResolvedValue(saved);

    repo.update
      .mockImplementationOnce(() => {
        throw new Error("gateway down");
      })
      .mockResolvedValueOnce({
        ...saved,
        status: PaymentStatus.FAILED,
        failureDetails: { message: "gateway down" },
      });

    const uc = new ProcessPaymentUseCase(repo as any);

    await expect(uc.execute(baseDto)).rejects.toThrow(BadRequestException);
  });
});
