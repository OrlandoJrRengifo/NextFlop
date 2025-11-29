import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ description: 'Nombre del perfil' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Icono o emoji del perfil' })
  @IsOptional()
  @IsString()
  icon?: string;
}
