import { ApiProperty } from "@nestjs/swagger"

/**
 * Payment Response DTO
 * Data Transfer Object for payment responses
 * Following Clean Architecture - Presentation layer
 */
export class PaymentResponseDto {
  @ApiProperty({ description: "Payment ID" })
  id: string

  @ApiProperty({ description: "User ID" })
  userId: string

  @ApiProperty({ description: "Subscription ID" })
  subscriptionId: string

  @ApiProperty({ description: "Payment amount" })
  amount: number

  @ApiProperty({ description: "Currency" })
  currency: string

  @ApiProperty({ description: "Payment status", enum: ["pending", "succeeded", "failed", "canceled", "refunded"] })
  status: string

  @ApiProperty({ description: "Payment method ID" })
  paymentMethodId: string

  @ApiProperty({ description: "Stripe payment intent ID", required: false })
  stripePaymentIntentId?: string

  @ApiProperty({
    description: "Discount applied",
    required: false,
    type: Object,
    example: { type: "percentage", value: 20, discountAmount: 3.2, description: "20% discount applied" },
  })
  discountApplied?: {
    type: string
    value: number
    discountAmount: number
    description: string
  }

  @ApiProperty({ description: "Points used", required: false })
  pointsUsed?: number

  @ApiProperty({ description: "Original amount before discounts", required: false })
  originalAmount?: number

  @ApiProperty({ description: "Failure reason", required: false })
  failureReason?: string

  @ApiProperty({ description: "Processing date", required: false })
  processedAt?: Date

  @ApiProperty({ description: "Creation date" })
  createdAt: Date

  @ApiProperty({ description: "Last update date" })
  updatedAt: Date
}
