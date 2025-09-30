import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, Min } from "class-validator";

/**
 * Process Payment DTO
 * Datos de entrada para procesar un pago
 */
export class ProcessPaymentDto {
  @ApiProperty({
    description: "ID del usuario que realiza el pago",
    example: "64f8b2c8e1234567890abcde",
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: "ID de la suscripción a pagar",
    example: "64f8b2c8e1234567890abcde",
  })
  @IsString()
  subscriptionId: string;

  @ApiProperty({
    description: "Monto original antes de aplicar puntos",
    example: 15.99,
  })
  @IsNumber()
  @Min(0.01)
  originalAmount: number;

  @ApiProperty({
    description: "Puntos a usar para descuento (opcional)",
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsToUse?: number;
}
