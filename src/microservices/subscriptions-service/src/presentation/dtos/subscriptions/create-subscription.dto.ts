import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDto {
  @ApiProperty({ description: "ID of the plan to subscribe to" })
  @IsString()
  @IsNotEmpty()
  planId: string;
}