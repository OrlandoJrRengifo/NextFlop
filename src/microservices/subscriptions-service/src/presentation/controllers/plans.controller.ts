import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PlansService } from "../../application/services/plans.service";
import { CreatePlanDto } from "../dto/create-plan.dto";

@ApiTags("Subscription Plans")
@Controller("api/subscriptions/plans")
export class PlansController {
  constructor(private readonly plansService: PlansService) {
    console.log("✅ PlansController initialized");
  }

  @Get()
  @ApiOperation({ summary: "Get all subscription plans" })
  @ApiResponse({ status: 200, description: "List of all active plans" })
  async getAllPlans() {
    console.log("📤 getAllPlans called");
    return this.plansService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get subscription plan by ID" })
  @ApiResponse({ status: 200, description: "Plan details" })
  async getPlan(@Param("id") planId: string) {
    const plan = await this.plansService.findById(planId);
    if (!plan) throw new HttpException("Plan not found", HttpStatus.NOT_FOUND);
    return plan;
  }

  @Post()
  @ApiOperation({ summary: "Create a new subscription plan" })
  @ApiResponse({ status: 201, description: "Plan created" })
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update subscription plan" })
  @ApiResponse({ status: 200, description: "Plan updated" })
  async updatePlan(@Param("id") planId: string, @Body() updatePlanDto: Partial<CreatePlanDto>) {
    return this.plansService.update(planId, updatePlanDto);
  }
}
