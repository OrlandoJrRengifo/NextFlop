import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxProfiles?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maxQuality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  features?: string[];
}
