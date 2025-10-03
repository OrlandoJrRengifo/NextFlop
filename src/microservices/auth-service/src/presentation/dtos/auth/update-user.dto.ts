import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail, MinLength, IsInt, Min } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Juan Pérez" })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: "juan@mail.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "newPassword123" })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;
}
