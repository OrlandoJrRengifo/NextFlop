import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport"; // <--- IMPORTANTE
import { JwtModule } from "@nestjs/jwt";           // <--- IMPORTANTE
import { ConfigModule, ConfigService } from "@nestjs/config";

import { SubscriptionsController } from "../controllers/subscriptions.controller";
import { CreateSubscriptionUseCase } from "../../application/use-cases/subscriptions/create-subscription.use-case";
import { CancelSubscriptionUseCase } from "../../application/use-cases/subscriptions/cancel-subscription.use-case";
import { RenewSubscriptionUseCase } from "../../application/use-cases/subscriptions/renew-subscription.use-case";
import { EventPublisher } from "../../application/services/event-publisher.service";
import { SubscriptionSchedulerService } from "../../application/services/subscription-scheduler.service";
import { SubscriptionRepository } from "../../infrastructure/repositories/subscription.repository";
import { SubscriptionPlanRepository } from "../../infrastructure/repositories/subscription-plan.repository";
import { SubscriptionDocument, SubscriptionSchema } from "../../infrastructure/database/schemas/subscription.schema";
import { AssignPlanUseCase } from "../../application/use-cases/subscriptions/assign-plan.use-case";
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from "../../infrastructure/database/schemas/subscription-plan.schema";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";
import { JwtStrategy } from "../strategies/jwt.strategy"; // <--- IMPORTANTE

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionDocument.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    // --- CORRECCIÓN: Reactivamos la seguridad ---
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
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
    AssignPlanUseCase,
    {
      provide: "ISubscriptionRepository",
      useClass: SubscriptionRepository,
    },
    {
      provide: "ISubscriptionPlanRepository",
      useClass: SubscriptionPlanRepository,
    },
    // --- CORRECCIÓN: Registramos la estrategia ---
    JwtStrategy, 
  ],
  exports: ["ISubscriptionRepository", "ISubscriptionPlanRepository", AssignPlanUseCase],
})
export class SubscriptionsModule {}