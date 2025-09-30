import type { SubscriptionPlan } from "../entities/subscription-plan.entity";

export interface ISubscriptionPlanRepository {
  findById(id: string): Promise<SubscriptionPlan | null>;
  findByName(name: string): Promise<SubscriptionPlan | null>;
  findAll(): Promise<SubscriptionPlan[]>;
  create(plan: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan>;
  update(id: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null>;
  delete(id: string): Promise<boolean>;
}