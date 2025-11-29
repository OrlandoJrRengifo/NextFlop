import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, IsString } from "class-validator";
import { Type } from "class-transformer";
import { UserOnboardingDto } from "./user-onboarding.dto";
import { PaymentOnboardingDto } from "./payment-onboarding.dto";
import { IsNumber, IsOptional, Min } from "class-validator";

export class CompleteOnboardingDto {
  @ApiProperty({ type: UserOnboardingDto })
  @ValidateNested()
  @Type(() => UserOnboardingDto)
  user: UserOnboardingDto;

  @ApiProperty()
  @IsString()
  planId: string;

  @ApiProperty({ type: PaymentOnboardingDto })
  @ValidateNested()
  @Type(() => PaymentOnboardingDto)
  payment: PaymentOnboardingDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsToRedeem?: number;
}
