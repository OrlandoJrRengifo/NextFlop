import { NotFoundException, BadRequestException } from "@nestjs/common";
import { CancelSubscriptionUseCase } from "../subscriptions/cancel-subscription.use-case";
import { SubscriptionStatus } from "../../../domain/entities/subscription.entity";

describe("CancelSubscriptionUseCase", () => {
  function makeMocks() {
    const subscriptionRepo: any = { findById: jest.fn(), update: jest.fn() };
    const eventPublisher: any = { publishSubscriptionCanceled: jest.fn() };
    return { subscriptionRepo, eventPublisher };
  }

  it("throws NotFoundException when subscription missing or not belong to user", async () => {
    const { subscriptionRepo, eventPublisher } = makeMocks();
    subscriptionRepo.findById.mockResolvedValue(null);
    const uc = new CancelSubscriptionUseCase(subscriptionRepo, eventPublisher);
    await expect(uc.execute("s1", "user1")).rejects.toThrow(NotFoundException);
  });

  it("throws BadRequestException when already canceled", async () => {
    const { subscriptionRepo, eventPublisher } = makeMocks();
    subscriptionRepo.findById.mockResolvedValue({
      id: "s1",
      userId: "user1",
      status: SubscriptionStatus.CANCELED,
      planId: "plan-x",
      endDate: new Date(Date.now() + 1000),
    });
    const uc = new CancelSubscriptionUseCase(subscriptionRepo, eventPublisher);
    await expect(uc.execute("s1", "user1")).rejects.toThrow(BadRequestException);
  });

  it("throws BadRequestException when expired", async () => {
    const { subscriptionRepo, eventPublisher } = makeMocks();
    subscriptionRepo.findById.mockResolvedValue({
      id: "s1",
      userId: "user1",
      status: SubscriptionStatus.EXPIRED,
      planId: "plan-x",
      endDate: new Date(0),
    });
    const uc = new CancelSubscriptionUseCase(subscriptionRepo, eventPublisher);
    await expect(uc.execute("s1", "user1")).rejects.toThrow(BadRequestException);
  });

  it("updates subscription to canceled and publishes event", async () => {
    const { subscriptionRepo, eventPublisher } = makeMocks();
    const now = new Date();
    const sub = {
      id: "s1",
      userId: "user1",
      status: SubscriptionStatus.ACTIVE,
      planId: "plan-x",
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24),
    };
    subscriptionRepo.findById.mockResolvedValue(sub);
    subscriptionRepo.update.mockResolvedValue({ ...sub, status: SubscriptionStatus.CANCELED });

    const uc = new CancelSubscriptionUseCase(subscriptionRepo, eventPublisher);
    await uc.execute(sub.id, sub.userId, "no longer needed");

    expect(subscriptionRepo.update).toHaveBeenCalledWith(sub.id, {
      status: SubscriptionStatus.CANCELED,
    });
    expect(eventPublisher.publishSubscriptionCanceled).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriptionId: sub.id,
        userId: sub.userId,
        planId: sub.planId,
        canceledAt: expect.any(Date),
        reason: expect.any(String),
        endDate: sub.endDate,
        timestamp: expect.any(Date),
      })
    );
  });
});
