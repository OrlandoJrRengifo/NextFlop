import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { ISubscriptionRepository, CreateSubscriptionData } from "../../../domain/repositories/subscription.repository.interface";
import { SubscriptionStatus } from "../../../domain/entities/subscription.entity";

@Injectable()
export class AssignPlanUseCase {
  constructor(
    @Inject("ISubscriptionRepository")
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    userId: string,
    planId: string,
  ) {
    if (!userId) {
      throw new BadRequestException("Missing userId");
    }

    // ========== 1. REVISAR SI YA TIENE UNA SUSCRIPCIÓN ACTIVA ==========
    const active = await this.subscriptionRepository.findActiveByUserId(userId);

    if (active) {
      // Marcamos la suscripción anterior como EXPIRED
      await this.subscriptionRepository.update(active.id, {
        status: SubscriptionStatus.EXPIRED,
        updatedAt: new Date(),
      });
    }

    // ========== 2. CREAR NUEVA SUSCRIPCIÓN ==========
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // +30 días (puedes cambiarlo a meses)

    const newSubscription: CreateSubscriptionData = {
      userId,
      planId,
      status: SubscriptionStatus.ACTIVE,
      consecutiveMonthsPaid: 1,
      startDate: now,
      endDate,
    };

    return await this.subscriptionRepository.create(newSubscription);
  }
}
