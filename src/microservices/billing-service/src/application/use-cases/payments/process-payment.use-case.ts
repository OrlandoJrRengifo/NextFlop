import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto"; // Nativo de Node
import {
  PAYMENT_REPOSITORY,
  IPaymentRepository,
} from "../../../domain/repositories/payment.repository.interface";
import { Payment, PaymentStatus } from "../../../domain/entities/payment.entity";

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(dto: {
    userId: string;
    subscriptionId: string;
    originalAmount: number;
    pointsToRedeem: number;

    cardNumber: string;
    expiration: string;
    cvv: string;
    nameOnCard: string;
  }): Promise<Payment> {
    const {
      userId,
      subscriptionId,
      originalAmount,
      pointsToRedeem,
      cardNumber,
      expiration,
      nameOnCard,
    } = dto;

    const finalAmount = Math.max(0, originalAmount - (pointsToRedeem ?? 0));

    const cardLast4 = cardNumber.slice(-4);
    const cardBrand = this.detectBrand(cardNumber);

    // CORRECCIÓN: Generamos UUID explícito para evitar problemas con Mongo
    const paymentId = randomUUID();

    const paymentEntity = new Payment(
      paymentId,
      userId,
      subscriptionId,
      originalAmount,
      finalAmount,
      pointsToRedeem,
      0,
      PaymentStatus.PENDING,
      undefined,
      new Date(),
      new Date(),
      cardLast4,
      cardBrand,
      expiration,
      nameOnCard,
    );

    const saved = await this.paymentRepository.create(paymentEntity);

    try {
      // Simulamos éxito con Stripe (aquí iría la lógica real)
      const updated = await this.paymentRepository.update(saved.id!, {
        status: PaymentStatus.SUCCEEDED,
        pointsGained: 100,
        updatedAt: new Date(),
      });

      return updated!;
    } catch (err: any) {
      await this.paymentRepository.update(saved.id!, {
        status: PaymentStatus.FAILED,
        failureDetails: { message: err.message },
        updatedAt: new Date(),
      });

      throw new BadRequestException(`Payment failed: ${err.message}`);
    }
  }

  private detectBrand(cardNumber: string): string {
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    if (cardNumber.startsWith("34") || cardNumber.startsWith("37"))
      return "American Express";
    return "Unknown";
  }
}