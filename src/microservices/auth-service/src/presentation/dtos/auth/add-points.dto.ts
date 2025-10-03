import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class AddPointsDto {
  @ApiProperty({ example: 50, description: "Points to add (can be negative to subtract)" })
  @Type(() => Number)   
  @IsNumber()
  points: number;

  @ApiProperty({ example: "Daily login bonus", description: "Reason for points change" })
  @IsString()
  reason: string;
}
