import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AssignPlanDto {
  @ApiProperty({
    example: "plan_basic_001",
    description: "ID del plan a asignar",
  })
  @IsString()
  planId: string;
}
