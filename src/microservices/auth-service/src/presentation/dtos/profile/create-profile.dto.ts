import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateProfileDto {
  @ApiProperty({
    description: "ID del usuario al que pertenece el perfil",
    example: "652f1c8e3d29b8a9c3b9c123",
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Nombre del perfil",
    example: "Perfil de Juan",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "URL del ícono/avatar del perfil",
    example: "https://example.com/avatar.png",
    required: false,
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;
}
