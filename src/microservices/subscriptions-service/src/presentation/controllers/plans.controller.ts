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
    // Se simplifica para usar el nuevo método findAll() sin parámetros
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
    // Se llama al constructor simplificado de la entidad
    const planEntity = new SubscriptionPlan(
      null, // id
      createPlanDto.name,
      createPlanDto.price,
      createPlanDto.maxProfiles
    );

    const plan = await this.planRepository.create(planEntity);
    return this.toResponseDto(plan);
  }

  // Los endpoints activate y deactivate se eliminan ya que el campo isActive no existe
  // Tampoco el endpoint getActivePlans

  private toResponseDto(plan: SubscriptionPlan): PlanResponseDto {
    // El DTO de respuesta también debe ser ajustado, pero por ahora mapeamos los campos existentes
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