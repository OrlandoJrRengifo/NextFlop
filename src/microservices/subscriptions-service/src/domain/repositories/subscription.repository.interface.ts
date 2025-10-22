import type { Subscription, SubscriptionStatus } from "../entities/subscription.entity";

export type CreateSubscriptionData = Omit<Subscription, "id" | "createdAt" | "updatedAt" | "isActive" | "isExpired">;

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserId(userId: string): Promise<Subscription | null>;
  findByStatus(status: SubscriptionStatus): Promise<Subscription[]>;
  findExpiringSubscriptions(days: number): Promise<Subscription[]>;
  create(subscriptionData: CreateSubscriptionData): Promise<Subscription>;
  update(id: string, subscription: Partial<Subscription>): Promise<Subscription | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<Subscription[]>;
  countByStatus(status: SubscriptionStatus): Promise<number>;
  findByPlanId(planId: string): Promise<Subscription[]>;
}