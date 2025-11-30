import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config"; // <--- Importamos Config

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
import { JwtStrategy } from "../strategies/jwt.strategy"; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentDocument.name, schema: PaymentSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Definimos estrategia por defecto
    // CORRECCIÓN: Usamos registerAsync para asegurar que lea el .env correcto
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    RabbitMQModule,
    StripeModule,
    ConfigModule, // Aseguramos que ConfigModule esté disponible
  ],
  controllers: [PaymentsController],
  providers: [
    ProcessPaymentUseCase,
    ExternalApiService,
    StripeService,
    EventPublisher,
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentsModule {}