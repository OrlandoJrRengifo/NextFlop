import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional } from "class-validator"

/**
 * Create Subscription DTO
 * Data Transfer Object for subscription creation
 * Following Clean Architecture - Presentation layer
 */
export class CreateSubscriptionDto {
  @ApiProperty({
    description: "Subscription plan ID",
    example: "64f8b2c8e1234567890abcde",
  })
  @IsString()
  planId: string

  @ApiProperty({
    description: "Payment method ID (optional)",
    example: "pm_1234567890abcdef",
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string
}
