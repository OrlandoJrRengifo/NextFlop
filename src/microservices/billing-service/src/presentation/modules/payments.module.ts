import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";  // ✅ IMPORTANTE
import { ProcessPaymentUseCase } from "../../application/use-cases/payments/process-payment.use-case";
import { PaymentRepository } from "../../infrastructure/repositories/payment.repository";
import { PAYMENT_REPOSITORY } from "../../domain/repositories/payment.repository.interface";
import { StripeService } from "../../infrastructure/stripe/stripe.service";
import { ExternalApiService } from "../../application/services/external-api.service";
import { PaymentsController } from "../controllers/payments.controller";
import { PaymentDocument, PaymentSchema } from "../../infrastructure/database/schemas/payment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentDocument.name, schema: PaymentSchema },
    ]),
    HttpModule, // ✅ para poder inyectar HttpService en ExternalApiService
  ],
  controllers: [PaymentsController],
  providers: [
    ProcessPaymentUseCase,
    ExternalApiService,
    StripeService,
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
  ],
})
export class PaymentsModule {}
