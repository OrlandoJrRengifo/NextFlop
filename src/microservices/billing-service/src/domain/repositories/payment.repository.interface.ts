// src/domain/repositories/payment.repository.interface.ts

import type { Payment, PaymentStatus } from "../entities/payment.entity";

export const PAYMENT_REPOSITORY = "IPaymentRepository";

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByUserId(userId: string): Promise<Payment[]>;
  findBySubscriptionId(subscriptionId: string): Promise<Payment[]>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  create(payment: Payment): Promise<Payment>;
  update(id: string, paymentData: Partial<Payment>): Promise<Payment | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<Payment[]>;
}
