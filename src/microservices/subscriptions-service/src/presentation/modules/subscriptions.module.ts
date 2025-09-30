import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { SubscriptionsController } from "../controllers/subscriptions.controller";
import { CreateSubscriptionUseCase } from "../../application/use-cases/subscriptions/create-subscription.use-case";
import { CancelSubscriptionUseCase } from "../../application/use-cases/subscriptions/cancel-subscription.use-case";
import { RenewSubscriptionUseCase } from "../../application/use-cases/subscriptions/renew-subscription.use-case";
import { EventPublisher } from "../../application/services/event-publisher.service";
import { SubscriptionSchedulerService } from "../../application/services/subscription-scheduler.service";
import { SubscriptionRepository } from "../../infrastructure/repositories/subscription.repository";
import { SubscriptionPlanRepository } from "../../infrastructure/repositories/subscription-plan.repository";
import { SubscriptionDocument, SubscriptionSchema } from "../../infrastructure/database/schemas/subscription.schema";
import {
  SubscriptionPlanDocument,
  SubscriptionPlanSchema,
} from "../../infrastructure/database/schemas/subscription-plan.schema";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
// 1. Importar la estrategia JWT
import { JwtStrategy } from "../strategies/jwt.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionDocument.name, schema: SubscriptionSchema },
      { name: SubscriptionPlanDocument.name, schema: SubscriptionPlanSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    }),
    RabbitMQModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    CreateSubscriptionUseCase,
    CancelSubscriptionUseCase,
    RenewSubscriptionUseCase,
    EventPublisher,
    SubscriptionSchedulerService,
    {
      provide: "ISubscriptionRepository",
      useClass: SubscriptionRepository,
    },
    {
      provide: "ISubscriptionPlanRepository",
      useClass: SubscriptionPlanRepository,
    },
    JwtAuthGuard,
    // 2. Añadir la estrategia a los providers
    JwtStrategy,
  ],
  exports: ["ISubscriptionRepository", "ISubscriptionPlanRepository"],
})
export class SubscriptionsModule {}