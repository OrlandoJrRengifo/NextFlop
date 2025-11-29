import { Module } from "@nestjs/common";
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
import { AssignPlanUseCase } from "../../application/use-cases/subscriptions/assign-plan.use-case";
import { SubscriptionPlan } from "../../infrastructure/database/schemas/subscription-plan.schema";
import {
  SubscriptionPlanDocument,
  SubscriptionPlanSchema,
} from "../../infrastructure/database/schemas/subscription-plan.schema";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionDocument.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    // Se eliminan PassportModule y JwtModule
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
    // Se eliminan JwtAuthGuard y JwtStrategy
  ],
  exports: ["ISubscriptionRepository", "ISubscriptionPlanRepository", AssignPlanUseCase],
})
export class SubscriptionsModule {}