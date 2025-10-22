import { NotFoundException, ConflictException } from "@nestjs/common";
import { CreateSubscriptionUseCase } from "../subscriptions/create-subscription.use-case";

describe("CreateSubscriptionUseCase", () => {
  function makeMocks() {
    const subscriptionRepo: any = { findActiveByUserId: jest.fn(), create: jest.fn() };
    const planRepo: any = { findById: jest.fn() };
    const eventPublisher: any = { publishSubscriptionCreated: jest.fn() };
    return { subscriptionRepo, planRepo, eventPublisher };
  }

  it("throws NotFoundException when plan doesn't exist", async () => {
    const { subscriptionRepo, planRepo, eventPublisher } = makeMocks();
    planRepo.findById.mockResolvedValue(null);
    const uc = new CreateSubscriptionUseCase(subscriptionRepo, planRepo, eventPublisher);
    await expect(uc.execute("user1", "plan-x")).rejects.toThrow(NotFoundException);
  });

  it("throws ConflictException when user already has active subscription", async () => {
    const { subscriptionRepo, planRepo, eventPublisher } = makeMocks();
    planRepo.findById.mockResolvedValue({ id: "plan-x", name: "P", price: 10 });
    subscriptionRepo.findActiveByUserId.mockResolvedValue({ id: "s1" }); // already exists
    const uc = new CreateSubscriptionUseCase(subscriptionRepo, planRepo, eventPublisher);
    await expect(uc.execute("user1", "plan-x")).rejects.toThrow(ConflictException);
  });

  it("creates subscription, persists and publishes event", async () => {
    const { subscriptionRepo, planRepo, eventPublisher } = makeMocks();
    const plan = { id: "plan-x", name: "Premium", price: 9.99 };
    planRepo.findById.mockResolvedValue(plan);
    subscriptionRepo.findActiveByUserId.mockResolvedValue(null);

    const created = {
      id: "sub-1",
      userId: "user1",
      planId: plan.id,
      status: "active",
      consecutiveMonthsPaid: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    subscriptionRepo.create.mockResolvedValue(created);

    const uc = new CreateSubscriptionUseCase(subscriptionRepo, planRepo, eventPublisher);
    const res = await uc.execute("user1", plan.id);

    expect(subscriptionRepo.create).toHaveBeenCalled();
    expect(res).toEqual(created);
    expect(eventPublisher.publishSubscriptionCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriptionId: created.id,
        userId: "user1",
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        timestamp: expect.any(Date),
      })
    );
  });
});
