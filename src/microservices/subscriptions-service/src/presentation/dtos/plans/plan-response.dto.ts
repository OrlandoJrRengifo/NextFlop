import { ApiProperty } from "@nestjs/swagger";

export class PlanResponseDto {
  @ApiProperty({ description: "Plan ID" })
  id: string;

  @ApiProperty({ description: "Plan name" })
  name: string;

  @ApiProperty({ description: "Plan price" })
  price: number;

  @ApiProperty({ description: "Maximum number of profiles" })
  maxProfiles: number;

  @ApiProperty({ description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  updatedAt: Date;
}