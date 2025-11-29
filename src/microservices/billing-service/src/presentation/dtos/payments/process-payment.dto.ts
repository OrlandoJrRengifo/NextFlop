import { ApiProperty } from "@nestjs/swagger";
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  Min, 
  Length, 
  IsNotEmpty,
  IsMongoId
} from "class-validator";
import { Type } from "class-transformer";

export class ProcessPaymentDto {

  @ApiProperty({
    description: "ID de la suscripción a pagar",
    example: "64f8b2c8e1234567890abcde",
  })
  @IsMongoId()
  subscriptionId: string;

  @ApiProperty({
    description: "Monto original antes de aplicar puntos",
    example: 15.99,
  })
  @Type(() => Number)   // ← IMPORTANTE
  @IsNumber()
  @Min(0.01)
  originalAmount: number;

  @ApiProperty({
    description: "Puntos a redimir (opcional)",
    example: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)   // ← evita error si viene como string
  @IsNumber()
  @Min(0)
  pointsToRedeem?: number;

  // -------- CAMPOS NUEVOS DEL MÉTODO DE PAGO --------

  @ApiProperty({
    description: "Número de tarjeta (NO SE GUARDA COMPLETO, solo se usa para generar last4 y brand)",
    example: "4242424242424242",
  })
  @IsString()
  @Length(13, 19)   // tarjetas pueden ser 13–19 dígitos
  cardNumber: string;

  @ApiProperty({
    description: "Fecha de expiración (MM/YY)",
    example: "12/27",
  })
  @IsString()
  @Length(5, 5)
  expiration: string;

  @ApiProperty({
    description: "Código de seguridad CVV",
    example: "123",
  })
  @IsString()
  @Length(3, 4)
  cvv: string;

  @ApiProperty({
    description: "Nombre del titular de la tarjeta",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  nameOnCard: string;
}
