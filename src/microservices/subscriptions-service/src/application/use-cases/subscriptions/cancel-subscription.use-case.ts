import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository.interface";
import { SubscriptionStatus } from "../../../domain/entities/subscription.entity";
import { EventPublisher } from "../../services/event-publisher.service";

@Injectable()
export class CancelSubscriptionUseCase {
  constructor(
    @Inject("ISubscriptionRepository")
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(subscriptionId: string, userId: string, reason?: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    if (!subscription || subscription.userId !== userId) {
      throw new NotFoundException("Subscription not found or does not belong to user");
    }

    if (subscription.status === SubscriptionStatus.CANCELED) {
      throw new BadRequestException("Subscription is already canceled");
    }

    if (subscription.status === SubscriptionStatus.EXPIRED) {
      throw new BadRequestException("Cannot cancel expired subscription");
    }

    // La lógica ahora se maneja aquí en lugar de en la entidad.
    // Actualizamos el estado de la suscripción directamente en la base de datos.
    await this.subscriptionRepository.update(subscriptionId, {
      status: SubscriptionStatus.CANCELED,
    });
    
    const canceledAt = new Date();

    // El evento ya no necesita campos que no existen
    await this.eventPublisher.publishSubscriptionCanceled({
      subscriptionId,
      userId,
      planId: subscription.planId,
      canceledAt: canceledAt,
      reason: reason || "User requested cancellation",
      endDate: subscription.endDate,
      timestamp: new Date(),
    });
  }
}