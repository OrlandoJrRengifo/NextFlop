import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsArray, IsInt, Min, Max,  IsNumber, ArrayNotEmpty } from "class-validator";
import { MediaType } from "../../../domain/entities/media.entity";
import { Transform } from "class-transformer";

export class SearchMediaDto {
  @ApiPropertyOptional() @IsOptional() @IsString() query?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    // Si llega como "horror,drama" -> convertir a array
    if (typeof value === "string") {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    // Si ya es array (genres=horro&genres=drama) devolver tal cual
    return Array.isArray(value) ? value.map((s) => String(s).trim()).filter(Boolean) : value;
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genres?: string[];


  @ApiPropertyOptional({ enum: ["movie","series","documentary"] }) @IsOptional() type?: MediaType;
  @ApiPropertyOptional() @IsOptional() @IsInt() minYear?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxYear?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber({}, { message: "minRating must be a number" }) @Min(0) @Max(10) minRating?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber({}, { message: "maxRating must be a number" }) @Min(0) maxRating?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() offset?: number = 0;
  @ApiPropertyOptional() @IsOptional() @IsInt() limit?: number = 20;
}
