export class User {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly birthDate: Date,
    public readonly email: string,
    public readonly password: string,
    public readonly currentPoints: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly plan?: string,
    public readonly paymentLast4?: string,
  ) {}

  public canSpendPoints(amount: number): boolean {
    return this.currentPoints >= amount && amount > 0;
  }
}
