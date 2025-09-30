import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, Min } from "class-validator";

export class CreatePlanDto {
  @ApiProperty({
    description: "Nombre del plan",
    example: "Básico",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Precio del plan",
    example: 9.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: "Número máximo de perfiles",
    example: 2,
  })
  @IsNumber()
  @Min(1)
  maxProfiles: number;
}