import { IsNotEmpty, IsOptional, Length } from "class-validator";

export class PaymentOnboardingDto {
  @Length(16, 16)
  cardNumber: string;

  @Length(5, 5) // MM/YY
  expiration: string;

  @Length(3, 4)
  cvv: string;

  @IsNotEmpty()
  nameOnCard: string;

  @IsOptional()
  pointsToRedeem?: number;
}
