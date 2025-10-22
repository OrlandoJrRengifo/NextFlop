import { Injectable } from "@nestjs/common";
// Se quita 'type' para que la importación exista en tiempo de ejecución
import { RabbitMQService } from "../../infrastructure/messaging/rabbitmq.service";

@Injectable()
export class EventPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publishPaymentSucceeded(event: {
    paymentId: string;
    userId: string;
    subscriptionId: string;
    finalAmount: number;
    originalAmount: number;
    discountApplied: number;
    pointsRedeemed: number;
    pointsGained: number;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("payment.succeeded", event);
  }

  async publishPaymentFailed(event: {
    paymentId: string;
    userId: string;
    subscriptionId: string;
    finalAmount: number;
    failureDetails: Record<string, any>;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("payment.failed", event);
  }

  // Se eliminan los eventos 'publishPaymentRefunded' y 'publishDiscountUsed'
  // ya que no corresponden a la lógica principal del diagrama.
}