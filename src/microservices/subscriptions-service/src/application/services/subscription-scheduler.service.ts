import { Injectable, Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ISubscriptionRepository } from "../../domain/repositories/subscription.repository.interface";
import { SubscriptionStatus } from "../../domain/entities/subscription.entity";
import { EventPublisher } from "./event-publisher.service";

@Injectable()
export class SubscriptionSchedulerService {
  constructor(
    @Inject("ISubscriptionRepository")
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleExpiredSubscriptions(): Promise<void> {
    console.log("🔍 Checking for expired subscriptions...");
    try {
      const expiredSubscriptions = await this.subscriptionRepository.findExpiringSubscriptions(0);
      for (const subscription of expiredSubscriptions) {
        if (subscription.status === SubscriptionStatus.ACTIVE) {
          await this.subscriptionRepository.update(subscription.id, {
            status: SubscriptionStatus.EXPIRED,
          });
          await this.eventPublisher.publishSubscriptionExpired({
            subscriptionId: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            expiredAt: new Date(),
            timestamp: new Date(),
          });
          console.log(`📅 Expired subscription: ${subscription.id}`);
        }
      }
      console.log(`✅ Processed ${expiredSubscriptions.length} expired subscriptions`);
    } catch (error) {
      console.error("❌ Error processing expired subscriptions:", error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async sendRenewalReminders(): Promise<void> {
    console.log("📧 Sending renewal reminders...");
    try {
      const expiringSubscriptions = await this.subscriptionRepository.findExpiringSubscriptions(3);
      for (const subscription of expiringSubscriptions) {
        if (subscription.status === SubscriptionStatus.ACTIVE) {
          // El evento de renovación ahora es más simple
          await this.eventPublisher.publishSubscriptionRenewed({
            subscriptionId: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            planName: "Renewal Reminder",
            newEndDate: subscription.endDate,
            timestamp: new Date(),
          });
          console.log(`📧 Sent renewal reminder for subscription: ${subscription.id}`);
        }
      }
      console.log(`✅ Sent ${expiringSubscriptions.length} renewal reminders`);
    } catch (error) {
      console.error("❌ Error sending renewal reminders:", error);
    }
  }
}