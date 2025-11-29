export interface PaymentResponse {
  id: string;
  userId: string;
  subscriptionId: string;
  originalAmount: number;
  finalAmount: number;
  pointsRedeemed: number;
  pointsGained: number;
  status: string;
}
