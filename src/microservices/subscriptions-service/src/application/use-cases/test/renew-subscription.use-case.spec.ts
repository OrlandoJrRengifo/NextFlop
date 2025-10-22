import { NotFoundException, BadRequestException } from "@nestjs/common";
import { RenewSubscriptionUseCase } from "../subscriptions/renew-subscription.use-case";
import { SubscriptionStatus } from "../../../domain/entities/subscription.entity";

describe("RenewSubscriptionUseCase", () => {
  function makeMocks() {
    const subscriptionRepo: any = { findById: jest.fn(), update: jest.fn() };
    const planRepo: any = { findById: jest.fn() };
    const eventPublisher: any = { publishSubscriptionRenewed: jest.fn() };
    return { subscriptionRepo, planRepo, eventPublisher };
  }

  it("throws NotFoundException when subscription missing or not belong to user", async () => {
    const { subscriptionRepo, planRepo, eventPublisher } = makeMocks();
    subscriptionRepo.findById.mockResolvedValue(null);
    const uc = new RenewSubscriptionUseCase(subscriptionRepo, planRepo, eventPublisher);
    await expect(uc.execute("s1", "user1")).rejects.toThrow(NotFoundException);
  });

  it("throws BadRequestException when subscription not active", async () => {
    const { subscriptionRepo, planRepo, eventPublisher } = makeMocks();
    const sub = {
      id: "s1",
      userId: "user1",
      status: SubscriptionStatus.CANCELED,
      planId: "plan-x",
      consecutiveMonthsPaid: 1,
      endDate: new Date(Date.now() + 1000 * 60 * 60),
      isActive: () => false, // <- importante
    };
    subscriptionRepo.findById.mockResolvedValue(sub);
    const uc = new RenewSubscriptionUseCase(subscriptionRepo, planRepo, eventPublisher);
    await expect(uc.execute("s1", "user1")).rejects.toThrow(BadRequestException);
  });

  it("throws NotFoundException when plan missing", async () => {
    const { subscriptionRepo, planRepo, eventPublisher } = makeMocks();
    const sub = {
      id: "s1",
      userId: "user1",
      status: SubscriptionStatus.ACTIVE,
      planId: "plan-x",
      consecutiveMonthsPaid: 1,
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      isActive: () => true, 
    };
    subscriptionRepo.findById.mockResolvedValue(sub);
    planRepo.findById.mockResolvedValue(null);
    const uc = new RenewSubscriptionUseCase(subscriptionRepo, planRepo, eventPublisher);
    await expect(uc.execute(sub.id, sub.userId)).rejects.toThrow(NotFoundException);
  });

  it("renews subscription, updates repo and publishes event", async () => {
    const { subscriptionRepo, planRepo, eventPublisher } = makeMocks();
    const now = new Date();
    const sub = {
      id: "s1",
      userId: "user1",
      status: SubscriptionStatus.ACTIVE,
      planId: "plan-x",
      consecutiveMonthsPaid: 2,
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
      isActive: () => true,
    };
    const plan = { id: "plan-x", name: "Premium" };
    subscriptionRepo.findById.mockResolvedValue(sub);
    planRepo.findById.mockResolvedValue(plan);

    const newEnd = new Date(sub.endDate);
    newEnd.setMonth(newEnd.getMonth() + 1);
    const updated = { ...sub, endDate: newEnd, consecutiveMonthsPaid: sub.consecutiveMonthsPaid + 1 };
    subscriptionRepo.update.mockResolvedValue(updated);

    const uc = new RenewSubscriptionUseCase(subscriptionRepo, planRepo, eventPublisher);
    await uc.execute(sub.id, sub.userId);

    expect(subscriptionRepo.update).toHaveBeenCalledWith(sub.id, expect.objectContaining({
      endDate: expect.any(Date),
      consecutiveMonthsPaid: sub.consecutiveMonthsPaid + 1,
    }));
    expect(eventPublisher.publishSubscriptionRenewed).toHaveBeenCalledWith(expect.objectContaining({
      subscriptionId: sub.id,
      userId: sub.userId,
      planId: sub.planId,
      planName: plan.name,
      newEndDate: expect.any(Date),
      timestamp: expect.any(Date),
    }));
  });
});
