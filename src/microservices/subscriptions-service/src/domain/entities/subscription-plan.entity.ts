export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly maxProfiles: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  public canSupportProfiles(profileCount: number): boolean {
    return profileCount <= this.maxProfiles;
  }
}