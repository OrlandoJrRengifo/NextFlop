import { Injectable, Inject, NotFoundException, ConflictException } from "@nestjs/common";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository.interface";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/subscription-plan.repository.interface";
import { Subscription, SubscriptionStatus } from "../../../domain/entities/subscription.entity";
import { EventPublisher } from "../../services/event-publisher.service";

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject("ISubscriptionRepository")
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject("ISubscriptionPlanRepository")
    private readonly planRepository: ISubscriptionPlanRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(userId: string, planId: string): Promise<Subscription> {
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new NotFoundException("Subscription plan not found");
    }

    const existingSubscription = await this.subscriptionRepository.findActiveByUserId(userId);
    if (existingSubscription) {
      throw new ConflictException("User already has an active subscription");
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscriptionData = {
      userId,
      planId,
      status: SubscriptionStatus.ACTIVE,
      consecutiveMonthsPaid: 1,
      startDate,
      endDate,
    };

    const newSubscription = await this.subscriptionRepository.create(subscriptionData);

    // Se eliminan los campos que ya no existen del evento
    await this.eventPublisher.publishSubscriptionCreated({
      subscriptionId: newSubscription.id,
      userId,
      planId,
      planName: plan.name,
      price: plan.price,
      startDate,
      endDate,
      timestamp: new Date(),
    });

    return newSubscription;
  }
}