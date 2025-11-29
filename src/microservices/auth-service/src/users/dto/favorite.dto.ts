import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @ApiProperty()
  @IsNotEmpty()
  movieId: string;
}
