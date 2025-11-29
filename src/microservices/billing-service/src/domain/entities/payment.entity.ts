export enum PaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export class Payment {
  constructor(
    public id: string | undefined,
    public userId: string,
    public subscriptionId: string,
    public originalAmount: number,
    public finalAmount: number,
    public pointsRedeemed: number,
    public pointsGained: number,
    public status: PaymentStatus,
    public failureDetails: Record<string, any> | undefined,
    public createdAt: Date,
    public updatedAt: Date,

    // --- Payment Method ---
    public cardLast4?: string,
    public cardBrand?: string,
    public expiration?: string,
    public nameOnCard?: string,
  ) {}
}
