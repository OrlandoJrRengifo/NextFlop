import { Injectable } from "@nestjs/common"
import type { RabbitMQService } from "../../infrastructure/messaging/rabbitmq.service"

/**
 * Event Publisher Service
 * Implements Observer Pattern for publishing domain events
 * Following Clean Architecture - Application layer
 */
@Injectable()
export class EventPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publishPaymentSucceeded(event: {
    paymentId: string
    userId: string
    subscriptionId: string
    amount: number
    originalAmount: number
    discountApplied: number
    pointsUsed: number
    stripePaymentIntentId: string
    timestamp: Date
  }): Promise<void> {
    await this.rabbitMQService.publish("payment.success", event)
  }

  async publishPaymentFailed(event: {
    paymentId: string
    userId: string
    subscriptionId: string
    amount: number
    failureReason: string
    timestamp: Date
  }): Promise<void> {
    await this.rabbitMQService.publish("payment.failed", event)
  }

  async publishPaymentRefunded(event: {
    paymentId: string
    userId: string
    subscriptionId: string
    refundAmount: number
    reason: string
    timestamp: Date
  }): Promise<void> {
    await this.rabbitMQService.publish("payment.refunded", event)
  }

  async publishDiscountUsed(event: {
    discountId: string
    discountCode: string
    userId: string
    paymentId: string
    discountAmount: number
    timestamp: Date
  }): Promise<void> {
    await this.rabbitMQService.publish("discount.used", event)
  }
}
