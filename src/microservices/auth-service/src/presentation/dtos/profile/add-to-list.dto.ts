// src/presentation/dtos/profile/add-to-list.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddToListDto {
  @ApiProperty({
    description: "ID of the media item to add to the list",
    example: "68f5a76657f96573ae39ad3a", // Ejemplo del ID de la película "datura"
  })
  @IsString()
  @IsNotEmpty()
  mediaId: string;
}