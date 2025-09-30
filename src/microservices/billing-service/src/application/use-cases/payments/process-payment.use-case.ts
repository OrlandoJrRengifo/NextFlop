import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { IPaymentRepository, PAYMENT_REPOSITORY } from "../../../domain/repositories/payment.repository.interface";
import { Payment, PaymentStatus } from "../../../domain/entities/payment.entity";
import { StripeService } from "../../../infrastructure/stripe/stripe.service";
import { ExternalApiService } from "../../services/external-api.service";

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    private readonly stripeService: StripeService,
    private readonly externalApiService: ExternalApiService,
  ) {}

  async execute(
    userId: string,
    subscriptionId: string,
    originalAmount: number,
    pointsToRedeem = 0,
  ): Promise<Payment> {
    let finalAmount = originalAmount;
    if (pointsToRedeem > 0) {
      finalAmount = Math.max(0, originalAmount - pointsToRedeem);
    }

    // No generamos UUID, dejamos que Mongo cree _id automáticamente
    const paymentEntity = new Payment(
      undefined, // id opcional
      userId,
      subscriptionId,
      originalAmount,
      finalAmount,
      pointsToRedeem,
      0,                 // pointsGained
      PaymentStatus.PENDING,
      undefined,
      new Date(),
      new Date(),
    );

    const payment = await this.paymentRepository.create(paymentEntity);

    try {
      const pointsGained = 100; // ejemplo
      const updated = await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.SUCCEEDED,
        pointsGained,
        updatedAt: new Date(),
      });

      return updated!;
    } catch (err: any) {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failureDetails: { message: err.message },
        updatedAt: new Date(),
      });

      throw new BadRequestException(`Payment failed: ${err.message}`);
    }
  }
}
