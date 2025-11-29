import { ApiProperty } from "@nestjs/swagger";
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength,
  IsDateString 
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "John Doe", maxLength: 100 })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    example: "1995-04-22",
    description: "Fecha de nacimiento en formato ISO YYYY-MM-DD"
  })
  @IsDateString()
  birthDate: string;        // ← NUEVO CAMPO
}
