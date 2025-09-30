// src/domain/entities/subscription.entity.ts

export class Subscription {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly planId: string,
    public readonly status: SubscriptionStatus,
    public readonly consecutiveMonthsPaid: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  public isActive(): boolean {
    const now = new Date();
    return this.status === SubscriptionStatus.ACTIVE && this.endDate > now;
  }

  public isExpired(): boolean {
    const now = new Date();
    return this.endDate <= now;
  }

  // Los otros métodos como cancel() y renew() se eliminan porque su lógica dependía
  // de campos que ya no existen. La lógica de cancelación/renovación ahora
  // se manejará directamente en los Casos de Uso.
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
}