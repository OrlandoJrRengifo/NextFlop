import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsArray, ArrayNotEmpty, IsInt, Min, IsUrl } from "class-validator";
import { MediaType } from "../../../domain/entities/media.entity";

export class CreateMediaDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: ["movie","series","documentary"] }) @IsString() type: MediaType;
  @ApiProperty({ type: [String] }) @IsArray() @ArrayNotEmpty() genres: string[];
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) rating?: number = 0;
  @ApiPropertyOptional() @IsOptional() @IsString() maturityRating?: string = "G";
  @ApiPropertyOptional() @IsOptional() @IsInt() releaseYear?: number;
  @ApiProperty() @IsInt() duration: number;
  @ApiPropertyOptional() @IsOptional() @IsUrl() posterUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() trailerUrl?: string;
  @ApiPropertyOptional() @IsOptional() isActive?: boolean = true;
}
