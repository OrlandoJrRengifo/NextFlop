import { ApiProperty } from "@nestjs/swagger";

export class SubscriptionResponseDto {
  @ApiProperty({ description: "Subscription ID" })
  id: string;

  @ApiProperty({ description: "User ID" })
  userId: string;

  @ApiProperty({ description: "Plan ID" })
  planId: string;

  @ApiProperty({ description: "Subscription status", enum: ["active", "expired", "canceled"] })
  status: string;
  
  @ApiProperty({ description: "Number of consecutive months paid" })
  consecutiveMonthsPaid: number;

  @ApiProperty({ description: "Subscription start date" })
  startDate: Date;

  @ApiProperty({ description: "Subscription end date" })
  endDate: Date;

  @ApiProperty({ description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  updatedAt: Date;
}