import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CancelSubscriptionDto {
  @ApiProperty({ description: "Reason for cancellation", required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}