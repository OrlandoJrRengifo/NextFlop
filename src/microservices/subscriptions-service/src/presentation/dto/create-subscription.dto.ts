import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planName: string;
}
