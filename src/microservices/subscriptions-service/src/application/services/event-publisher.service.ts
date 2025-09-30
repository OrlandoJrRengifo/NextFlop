import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "../../infrastructure/messaging/rabbitmq.service";

@Injectable()
export class EventPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publishSubscriptionCreated(event: {
    subscriptionId: string;
    userId: string;
    planId: string;
    planName: string;
    price: number;
    startDate: Date;
    endDate: Date;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("subscription.created", event);
  }

  async publishSubscriptionCanceled(event: {
    subscriptionId: string;
    userId: string;
    planId: string;
    canceledAt: Date;
    reason: string;
    endDate: Date;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("subscription.canceled", event);
  }

  async publishSubscriptionRenewed(event: {
    subscriptionId: string;
    userId: string;
    planId: string;
    planName: string;
    newEndDate: Date;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("subscription.renewed", event);
  }

  async publishSubscriptionExpired(event: {
    subscriptionId: string;
    userId: string;
    planId: string;
    expiredAt: Date;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("subscription.expired", event);
  }

  // Este evento parece no usarse, pero lo dejamos por si acaso
  async publishSubscriptionActivated(event: {
    subscriptionId: string;
    userId: string;
    planId: string;
    planName: string;
    activatedAt: Date;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("subscription.activated", event);
  }
}