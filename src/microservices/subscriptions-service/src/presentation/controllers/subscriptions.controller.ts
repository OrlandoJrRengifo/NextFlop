import { Controller, Get, Post, Put, Param, UseGuards, Inject, Body, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Request } from 'express';
import { CreateSubscriptionUseCase } from "../../application/use-cases/subscriptions/create-subscription.use-case";
import { CancelSubscriptionUseCase } from "../../application/use-cases/subscriptions/cancel-subscription.use-case";
import { RenewSubscriptionUseCase } from "../../application/use-cases/subscriptions/renew-subscription.use-case";
import { ISubscriptionRepository } from "../../domain/repositories/subscription.repository.interface";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateSubscriptionDto } from "../dtos/subscriptions/create-subscription.dto";
import { CancelSubscriptionDto } from "../dtos/subscriptions/cancel-subscription.dto";
import { SubscriptionResponseDto } from "../dtos/subscriptions/subscription-response.dto";
import { Subscription } from "../../domain/entities/subscription.entity";

@ApiTags("Subscriptions")
@Controller("subscriptions")
@UseGuards(JwtAuthGuard)      // Reactivado
@ApiBearerAuth("JWT-auth")  // Reactivado
export class SubscriptionsController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private readonly renewSubscriptionUseCase: RenewSubscriptionUseCase,
    
    @Inject("ISubscriptionRepository")
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new subscription" })
  @ApiResponse({ status: 201, description: "Subscription created", type: SubscriptionResponseDto })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() request: Request): Promise<SubscriptionResponseDto> {
    const user = request.user as any; // Obtenemos el usuario directamente de la petición
    const subscription = await this.createSubscriptionUseCase.execute(
      user.userId,
      createSubscriptionDto.planId,
    );
    return this.toResponseDto(subscription);
  }

  @Get("my-subscriptions")
  @ApiOperation({ summary: "Get user subscriptions" })
  @ApiResponse({ status: 200, description: "User subscriptions", type: [SubscriptionResponseDto] })
  async getUserSubscriptions(@Req() request: Request): Promise<SubscriptionResponseDto[]> {
    const user = request.user as any;
    const subscriptions = await this.subscriptionRepository.findByUserId(user.userId);
    return subscriptions.map((sub) => this.toResponseDto(sub));
  }

  @Get("active")
  @ApiOperation({ summary: "Get user active subscription" })
  @ApiResponse({ status: 200, description: "Active subscription", type: SubscriptionResponseDto })
  async getActiveSubscription(@Req() request: Request): Promise<SubscriptionResponseDto | null> {
    const user = request.user as any;
    const subscription = await this.subscriptionRepository.findActiveByUserId(user.userId);
    return subscription ? this.toResponseDto(subscription) : null;
  }

  @Put(":id/cancel")
  @ApiOperation({ summary: "Cancel subscription" })
  @ApiResponse({ status: 200, description: "Subscription canceled" })
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
  @ApiOperation({ summary: "Renew subscription" })
  @ApiResponse({ status: 200, description: "Subscription renewed" })
  async renewSubscription(@Param("id") subscriptionId: string, @Req() request: Request): Promise<{ message: string }> {
    const user = request.user as any;
    await this.renewSubscriptionUseCase.execute(subscriptionId, user.userId);
    return { message: "Subscription renewed successfully" };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get subscription by ID" })
  @ApiResponse({ status: 200, description: "Subscription details", type: SubscriptionResponseDto })
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
    };
  }
}