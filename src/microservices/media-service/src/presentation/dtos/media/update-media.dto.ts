import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsArray, IsInt, Min, IsUrl } from "class-validator";
import { MediaType } from "../../../domain/entities/media.entity";

export class UpdateMediaDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: ["movie","series","documentary"] }) @IsOptional() type?: MediaType;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() genres?: string[];
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) rating?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() maturityRating?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() releaseYear?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsUrl() posterUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() trailerUrl?: string;
  @ApiPropertyOptional() @IsOptional() isActive?: boolean;
}
