import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { PaymentsController } from "../controllers/payments.controller";
import { ProcessPaymentUseCase } from "../../application/use-cases/payments/process-payment.use-case";
import { PaymentRepository } from "../../infrastructure/repositories/payment.repository";
import { PAYMENT_REPOSITORY } from "../../domain/repositories/payment.repository.interface";
import { StripeService } from "../../infrastructure/stripe/stripe.service";
import { ExternalApiService } from "../../application/services/external-api.service";
import { EventPublisher } from "../../application/services/event-publisher.service";
import { PaymentDocument, PaymentSchema } from "../../infrastructure/database/schemas/payment.schema";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";
import { StripeModule } from "../../infrastructure/stripe/stripe.module";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
// 1. Importar la JwtStrategy
import { JwtStrategy } from "../strategies/jwt.strategy"; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentDocument.name, schema: PaymentSchema },
    ]),
    PassportModule,
    JwtModule.register({ // Esta configuración debería ser asíncrona para usar el .env
      secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    }),
    HttpModule,
    RabbitMQModule,
    StripeModule,
  ],
  controllers: [PaymentsController],
  providers: [
    ProcessPaymentUseCase,
    ExternalApiService,
    StripeService,
    EventPublisher, // EventPublisher también debe estar aquí si se usa
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
    JwtAuthGuard,
    // 2. Añadir la JwtStrategy a los providers
    JwtStrategy,
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentsModule {}