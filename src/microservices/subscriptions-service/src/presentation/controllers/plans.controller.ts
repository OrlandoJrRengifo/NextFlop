import { Controller, Get, Post, Put, Body, Param, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { CreatePlanDto } from "../dtos/plans/create-plan.dto";
import { PlanResponseDto } from "../dtos/plans/plan-response.dto";
import { SubscriptionPlan } from "../../domain/entities/subscription-plan.entity";

@ApiTags("Subscription Plans")
@Controller("plans")
export class PlansController {
  constructor(
    @Inject("ISubscriptionPlanRepository")
    private readonly planRepository: ISubscriptionPlanRepository
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all subscription plans" })
  @ApiResponse({ status: 200, description: "List of all plans", type: [PlanResponseDto] })
  async getAllPlans(): Promise<PlanResponseDto[]> {
    const plans = await this.planRepository.findAll();
    return plans.map((plan) => this.toResponseDto(plan));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get subscription plan by ID" })
  @ApiResponse({ status: 200, description: "Plan details", type: PlanResponseDto })
  async getPlan(@Param("id") planId: string): Promise<PlanResponseDto | null> {
    const plan = await this.planRepository.findById(planId);
    return plan ? this.toResponseDto(plan) : null;
  }

  @Post()
  @ApiOperation({ summary: "Create a new subscription plan" })
  @ApiResponse({ status: 201, description: "Plan created", type: PlanResponseDto })
  async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    const planEntity = new SubscriptionPlan(
      null,
      createPlanDto.name,
      createPlanDto.price,
      createPlanDto.maxProfiles
    );

    const plan = await this.planRepository.create(planEntity);
    return this.toResponseDto(plan);
  }

  private toResponseDto(plan: SubscriptionPlan): PlanResponseDto {
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      maxProfiles: plan.maxProfiles,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
