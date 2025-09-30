import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository.interface";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/subscription-plan.repository.interface";
import { EventPublisher } from "../../services/event-publisher.service";
import { Subscription } from "../../../domain/entities/subscription.entity";

@Injectable()
export class RenewSubscriptionUseCase {
  constructor(
    @Inject("ISubscriptionRepository")
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject("ISubscriptionPlanRepository")
    private readonly planRepository: ISubscriptionPlanRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(subscriptionId: string, userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    if (!subscription || subscription.userId !== userId) {
      throw new NotFoundException("Subscription not found or does not belong to the user");
    }

    if (!subscription.isActive()) {
      throw new BadRequestException("Subscription cannot be renewed");
    }

    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      throw new NotFoundException("Subscription plan not found");
    }

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    
    const renewedSubscription = await this.subscriptionRepository.update(subscriptionId, {
      endDate: newEndDate,
      consecutiveMonthsPaid: (subscription.consecutiveMonthsPaid || 0) + 1,
    });

    if (!renewedSubscription) {
        throw new Error('Failed to renew subscription');
    }

    // Se eliminan los campos que ya no existen del evento
    await this.eventPublisher.publishSubscriptionRenewed({
      subscriptionId,
      userId: subscription.userId,
      planId: subscription.planId,
      planName: plan.name,
      newEndDate: renewedSubscription.endDate,
      timestamp: new Date(),
    });
  }
}