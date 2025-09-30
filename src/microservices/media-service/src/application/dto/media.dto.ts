import { MediaType } from "../../domain/entities/media.entity";
import {
    IsString, IsOptional, IsInt, Min, IsArray, ArrayNotEmpty, IsUrl, IsIn, IsNumber,
    Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class CreateMediaDto {
    @ApiProperty({
        description: "Media title",
        example: "The Matrix",
    })
    @IsString() title!: string;

    @ApiProperty({
    description: "Media description",
    example: "A computer programmer discovers reality is a simulation",
    })
    @IsString() @IsOptional() description?: string;

    @ApiProperty({
    description: "Media type",
    example: "movie",
  })
    @IsIn([MediaType.MOVIE, MediaType.SERIES, MediaType.DOCUMENTARY])
    type!: MediaType;

    @ApiProperty({
    description: "Media genre",
    example: "Science Fiction",
  })
    @IsArray() @ArrayNotEmpty() genres!: string[];

    @ApiProperty({
    description: "Media rating (0-10)",
    example: 8.7,
    minimum: 0,
    maximum: 10,
  })
    @IsNumber() @Min(0) @Max(10) @IsOptional() rating?: number = 0;

    @ApiProperty({
    description: "Maturity rating",
    example: "PG-13",
  })
    @IsString() maturityRating!: string;

    @ApiProperty({
    description: "Release year",
    example: 1999,
  })
    @IsInt() @Min(1900)  @Max(3000) @IsOptional() releaseYear?: number;

    @ApiProperty({
    description: "Duration in minutes",
    example: 136,
  })
    @IsInt() @Min(0) duration!: number;

    @ApiProperty({
    description: "Poster image URL",
    example: "https://example.com/poster.jpg",
  })
    @IsUrl() posterUrl!: string;

    @ApiProperty({
    description: "Trailer video URL",
    example: "https://youtube.com/watch?v=abc123",
    required: false,
  })
    @IsUrl() @IsOptional() trailerUrl?: string;

    @IsOptional() isActive?: boolean = true;
}

export class UpdateMediaDto {
    @IsOptional() @IsString() title?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsIn([MediaType.MOVIE, MediaType.SERIES, MediaType.DOCUMENTARY]) type?: MediaType;
    @IsOptional() @IsArray() genres?: string[];
    @IsOptional() @IsNumber() rating?: number;
    @IsOptional() @IsString() maturityRating?: string;
    @IsOptional() @IsInt() releaseYear?: number;
    @IsOptional() @IsInt() duration?: number;
    @IsOptional() @IsUrl() posterUrl?: string;
    @IsOptional() @IsUrl() trailerUrl?: string;
    @IsOptional() isActive?: boolean;
}

export class MediaResponseDto {
    id!: string;
    title!: string;
    description?: string;
    type!: MediaType;
    genres!: string[];
    rating!: number;
    maturityRating!: string;
    releaseYear!: number;
    duration!: number;
    posterUrl!: string;
    trailerUrl?: string;
    isActive!: boolean;
    viewCount!: number;
    averageRating!: number;
    totalRatings!: number;
    createdAt!: Date;
    updatedAt!: Date;
}
