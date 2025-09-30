import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlansController } from "../controllers/plans.controller";
import { SubscriptionPlanRepository } from "../../infrastructure/repositories/subscription-plan.repository";
import {
  SubscriptionPlanDocument,
  SubscriptionPlanSchema,
} from "../../infrastructure/database/schemas/subscription-plan.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: SubscriptionPlanDocument.name, schema: SubscriptionPlanSchema }])],
  controllers: [PlansController],
  providers: [
    {
      provide: "ISubscriptionPlanRepository", // Usamos el texto directamente
      useClass: SubscriptionPlanRepository,
    },
  ],
  exports: ["ISubscriptionPlanRepository"], // Usamos el texto directamente
})
export class PlansModule {}