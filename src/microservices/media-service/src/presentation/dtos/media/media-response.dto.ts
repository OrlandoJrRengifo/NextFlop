import { ApiProperty } from "@nestjs/swagger";
import { MediaType } from "../../../domain/entities/media.entity";

export class MediaResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() description?: string;
  @ApiProperty({ enum: ["movie","series","documentary"] }) type: MediaType;
  @ApiProperty({ type: [String] }) genres: string[];
  @ApiProperty() rating: number;
  @ApiProperty() maturityRating: string;
  @ApiProperty() releaseYear: number;
  @ApiProperty() duration: number;
  @ApiProperty() posterUrl?: string;
  @ApiProperty() trailerUrl?: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() viewCount: number;
  @ApiProperty() averageRating: number;
  @ApiProperty() totalRatings: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
