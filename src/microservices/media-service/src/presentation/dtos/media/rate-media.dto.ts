import { IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class RateMediaDto {
  @ApiProperty({
    description: "Rating value between 1 and 10",
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  rate: number;
}
