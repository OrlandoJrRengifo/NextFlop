import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class PaymentOnboardingDto {
  @ApiProperty({ example: "4242424242424242" })
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty({ example: "12/30" })
  @IsString()
  @IsNotEmpty()
  expiration: string;

  @ApiProperty({ example: "123" })
  @IsString()
  @IsNotEmpty()
  cvv: string;

  @ApiProperty({ example: "Juan Perez" })
  @IsString()
  @IsNotEmpty()
  nameOnCard: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsToRedeem?: number;
}