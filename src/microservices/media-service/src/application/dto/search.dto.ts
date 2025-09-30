import { IsOptional, IsArray, IsIn, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";   
import { MediaType } from "../../domain/entities/media.entity";
import { ApiProperty } from "@nestjs/swagger"

export class MediaSearchDto {
    @ApiProperty({
      description: "Search query for title or description",
      example: "matrix",
      required: false,
    })
  @IsOptional()
  query?: string;

  @ApiProperty({
  description: "Filter by genres",
  example: ["Action", "Drama"],
  required: false,
  type: [String],
  })
  @IsOptional()
  @IsArray()
  genres?: string[];

  @ApiProperty({
    description: "Filter by media type",
    example: "movie",
    enum: ["movie","series","documentary"],
    required: false,
  })
  @IsOptional()
  @IsIn([MediaType.MOVIE, MediaType.SERIES, MediaType.DOCUMENTARY])
  type?: MediaType;

  @ApiProperty({
    description: "Filter by release year (minimum)",
    example: 1990,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)   
  @IsInt()
  minYear?: number;

  @ApiProperty({
    description: "Filter by release year (maximum)",
    example: 2020,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxYear?: number;

  @ApiProperty({
    description: "Minimum rating filter",
    example: 7.0,
    minimum: 0,
    maximum: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minRating?: number;

  @ApiProperty({
    description: "Maximum rating filter",
    example: 10.0,
    minimum: 0,
    maximum: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxRating?: number;

  @ApiProperty({
    description: "Pagination offset",
    example: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;   

  @ApiProperty({
    description: "Pagination limit",
    example: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;    
}
