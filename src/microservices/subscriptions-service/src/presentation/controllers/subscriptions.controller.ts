import {
  Controller, Get, Post, Put, Param, UseGuards, Inject, Body, Req
} from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from "@nestjs/swagger";

import { Request } from 'express';
import { CreateSubscriptionUseCase } from "../../application/use-cases/subscriptions/create-subscription.use-case";
import { CancelSubscriptionUseCase } from "../../application/use-cases/subscriptions/cancel-subscription.use-case";
import { RenewSubscriptionUseCase } from "../../application/use-cases/subscriptions/renew-subscription.use-case";
import { AssignPlanUseCase } from "../../application/use-cases/subscriptions/assign-plan.use-case";
import { ISubscriptionRepository } from "../../domain/repositories/subscription.repository.interface";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateSubscriptionDto } from "../dtos/subscriptions/create-subscription.dto";
import { CancelSubscriptionDto } from "../dtos/subscriptions/cancel-subscription.dto";
import { AssignPlanDto } from "../dtos/subscriptions/assign-plan.dto";
import { SubscriptionResponseDto } from "../dtos/subscriptions/subscription-response.dto";
import { Subscription } from "../../domain/entities/subscription.entity";

@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private readonly renewSubscriptionUseCase: RenewSubscriptionUseCase,
    private readonly assignPlanUseCase: AssignPlanUseCase,

    @Inject("ISubscriptionRepository")
    private readonly subscriptionRepository: ISubscriptionRepository,

    @Inject("ISubscriptionPlanRepository")
    private readonly planRepository: ISubscriptionPlanRepository,
  ) { }

  @Post("assign")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Assign a plan to the authenticated user" })
  @ApiResponse({ status: 201, description: "Plan assigned successfully", type: SubscriptionResponseDto })
  async assignPlan(@Body() dto: AssignPlanDto, @Req() request: Request): Promise<SubscriptionResponseDto> {
    const user = request.user as any;
    const subscription = await this.assignPlanUseCase.execute(user.userId, dto.planId);
    return this.toResponseDto(subscription);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new subscription" })
  @ApiResponse({ status: 201, description: "Subscription created", type: SubscriptionResponseDto })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() request: Request): Promise<SubscriptionResponseDto> {
    const user = request.user as any;
    
    const subscription = await this.createSubscriptionUseCase.execute(
      user.userId,
      createSubscriptionDto.planId,
    );

    const plan = await this.planRepository.findById(createSubscriptionDto.planId);
    const price = plan ? plan.price : 0;

    const response = this.toResponseDto(subscription);
    response.price = price;
    return response;
  }

  @Get("my-subscriptions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserSubscriptions(@Req() request: Request): Promise<SubscriptionResponseDto[]> {
    const user = request.user as any;
    const subscriptions = await this.subscriptionRepository.findByUserId(user.userId);
    return subscriptions.map((sub) => this.toResponseDto(sub));
  }

  @Get("active")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getActiveSubscription(@Req() request: Request): Promise<SubscriptionResponseDto | null> {
    const user = request.user as any;
    const subscription = await this.subscriptionRepository.findActiveByUserId(user.userId);
    return subscription ? this.toResponseDto(subscription) : null;
  }

  @Put(":id/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancelSubscription(
    @Param("id") subscriptionId: string,
    @Body() cancelDto: CancelSubscriptionDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = request.user as any;
    await this.cancelSubscriptionUseCase.execute(subscriptionId, user.userId, cancelDto.reason);
    return { message: "Subscription canceled successfully" };
  }

  @Put(":id/renew")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async renewSubscription(@Param("id") subscriptionId: string, @Req() request: Request): Promise<{ message: string }> {
    const user = request.user as any;
    await this.renewSubscriptionUseCase.execute(subscriptionId, user.userId);
    return { message: "Subscription renewed successfully" };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getSubscription(@Param("id") subscriptionId: string): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    return subscription ? this.toResponseDto(subscription) : null;
  }

  private toResponseDto(subscription: Subscription): SubscriptionResponseDto {
    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      consecutiveMonthsPaid: subscription.consecutiveMonthsPaid,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      price: 0,
    };
  }
}