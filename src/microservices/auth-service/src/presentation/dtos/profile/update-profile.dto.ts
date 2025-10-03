import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: "Nuevo nombre del perfil",
    example: "Perfil de María",
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description: "Nueva URL del icono del perfil",
    example: "https://example.com/new-icon.png",
  })
  @IsOptional()
  @IsString()
  iconUrl?: string
}
