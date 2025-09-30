import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, MaxLength } from "class-validator"

/**
 * Cancel Subscription DTO
 * Data Transfer Object for subscription cancellation
 * Following Clean Architecture - Presentation layer
 */
export class CancelSubscriptionDto {
  @ApiProperty({
    description: "Reason for cancellation",
    example: "Too expensive",
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string
}
