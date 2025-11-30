import { Controller, Get, Post, Put, Body, Param, Inject, InternalServerErrorException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { CreatePlanDto } from "../dtos/plans/create-plan.dto";
import { PlanResponseDto } from "../dtos/plans/plan-response.dto"; // Asegúrate que este archivo exista
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
  async getAllPlans(): Promise<PlanResponseDto[]> {
    try {
      console.log("Consultando planes en DB...");
      const plans = await this.planRepository.findAll();
      console.log("Planes encontrados:", plans);
      return plans.map((plan) => this.toResponseDto(plan));
    } catch (error) {
      console.error("ERROR CRÍTICO EN GET / PLANS:", error);
      throw new InternalServerErrorException("Error al obtener los planes. Revisa los logs del servidor.");
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get subscription plan by ID" })
  async getPlan(@Param("id") planId: string): Promise<PlanResponseDto | null> {
    const plan = await this.planRepository.findById(planId);
    return plan ? this.toResponseDto(plan) : null;
  }

  @Post()
  @ApiOperation({ summary: "Create a new subscription plan" })
  async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    try {
      const planEntity = new SubscriptionPlan(
        "", // ID generado por DB
        createPlanDto.name,
        createPlanDto.price,
        createPlanDto.maxProfiles
        // Removemos timestamps del constructor si la entidad no los pide obligatorios al crear
      );

      const plan = await this.planRepository.create(planEntity);
      return this.toResponseDto(plan);
    } catch (error) {
      console.error("ERROR AL CREAR PLAN:", error);
      throw new InternalServerErrorException("No se pudo crear el plan");
    }
  }

  private toResponseDto(plan: SubscriptionPlan): PlanResponseDto {
    // Protección contra valores nulos en la base de datos antigua
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      maxProfiles: plan.maxProfiles,
      createdAt: plan.createdAt || new Date(),
      updatedAt: plan.updatedAt || new Date(),
    } as any;
  }
}