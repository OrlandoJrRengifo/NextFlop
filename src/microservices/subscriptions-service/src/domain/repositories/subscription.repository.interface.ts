import type { Subscription, SubscriptionStatus } from "../entities/subscription.entity";

// Creamos un tipo para los datos de creación, que no incluye los métodos de la entidad
export type CreateSubscriptionData = Omit<Subscription, "id" | "createdAt" | "updatedAt" | "isActive" | "isExpired">;

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserId(userId: string): Promise<Subscription | null>;
  findByStatus(status: SubscriptionStatus): Promise<Subscription[]>;
  findExpiringSubscriptions(days: number): Promise<Subscription[]>;
  // El método create ahora usa el tipo de datos simple
  create(subscriptionData: CreateSubscriptionData): Promise<Subscription>;
  update(id: string, subscription: Partial<Subscription>): Promise<Subscription | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<Subscription[]>;
  countByStatus(status: SubscriptionStatus): Promise<number>;
  findByPlanId(planId: string): Promise<Subscription[]>;
}