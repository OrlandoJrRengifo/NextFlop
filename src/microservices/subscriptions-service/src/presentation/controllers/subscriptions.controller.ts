import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { SubscriptionsService } from "../../application/services/subscriptions.service";
import { CreateSubscriptionDto } from "../dto/create-subscription.dto";

@ApiTags("Subscriptions")
@Controller("api/subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user subscription" })
  @ApiResponse({ status: 200, description: "User subscription details" })
  async getUserSubscription(@Req() req) {
    const userId = req.user.id;
    const subscription = await this.subscriptionsService.findByUserId(userId);
    if (!subscription) {
      throw new HttpException("No active subscription found", HttpStatus.NOT_FOUND);
    }
    return subscription;
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get subscription by ID" })
  @ApiResponse({ status: 200, description: "Subscription details" })
  async getSubscription(@Param("id") subscriptionId: string, @Req() req) {
    const subscription = await this.subscriptionsService.findById(subscriptionId);
    if (!subscription) {
      throw new HttpException("Subscription not found", HttpStatus.NOT_FOUND);
    }
    // Verify ownership
    if (subscription.userId.toString() !== req.user.id) {
      throw new HttpException("Unauthorized", HttpStatus.FORBIDDEN);
    }
    return subscription;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new subscription" })
  @ApiResponse({ status: 201, description: "Subscription created" })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() req) {
    const userId = req.user.id;
    return this.subscriptionsService.create({
      userId,
      ...createSubscriptionDto,
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancel subscription" })
  @ApiResponse({ status: 200, description: "Subscription cancelled" })
  async cancelSubscription(@Param("id") subscriptionId: string, @Req() req) {
    const subscription = await this.subscriptionsService.findById(subscriptionId);
    if (!subscription) {
      throw new HttpException("Subscription not found", HttpStatus.NOT_FOUND);
    }
    if (subscription.userId.toString() !== req.user.id) {
      throw new HttpException("Unauthorized", HttpStatus.FORBIDDEN);
    }
    return this.subscriptionsService.cancel(subscriptionId, "User cancelled");
  }

  @Put(":id/reactivate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Reactivate cancelled subscription" })
  @ApiResponse({ status: 200, description: "Subscription reactivated" })
  async reactivateSubscription(@Param("id") subscriptionId: string, @Req() req) {
    const subscription = await this.subscriptionsService.findById(subscriptionId);
    if (!subscription) {
      throw new HttpException("Subscription not found", HttpStatus.NOT_FOUND);
    }
    if (subscription.userId.toString() !== req.user.id) {
      throw new HttpException("Unauthorized", HttpStatus.FORBIDDEN);
    }
    return this.subscriptionsService.reactivate(subscriptionId);
  }
}
