/**
 * Subscription Plan Domain Entity
 * Represents the core business logic for subscription plans
 * Following Clean Architecture principles - Domain layer
 */
export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly maxProfiles: number,
    // Los timestamps son opcionales aquí, pero útiles si los necesitas en la lógica
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  // Este método todavía es válido ya que solo depende de maxProfiles
  public canSupportProfiles(profileCount: number): boolean {
    return profileCount <= this.maxProfiles;
  }
}