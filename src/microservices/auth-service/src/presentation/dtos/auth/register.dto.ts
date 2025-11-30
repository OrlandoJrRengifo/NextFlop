import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "John Doe", maxLength: 100 })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: '1990-01-01', description: 'Birth date in YYYY-MM-DD format' })
  @IsString()
  birthDate?: string;

  @ApiProperty({ example: 'basic', description: 'Selected plan id (basic|medium|premium)' })
  @IsString()
  plan?: string;

  @ApiProperty({ description: 'Optional payment data (only last4 stored in this mock)', required: false })
  payment?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardName?: string;
  };

  @ApiProperty({ description: 'Optional payment last 4 digits when using a separate payment endpoint', required: false })
  @IsString()
  paymentLast4?: string;
}
