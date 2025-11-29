import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlansController } from "../controllers/plans.controller";
import { PlansService } from "../../application/services/plans.service";
import { Plan, PlanSchema } from "../../domain/schemas/plan.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}