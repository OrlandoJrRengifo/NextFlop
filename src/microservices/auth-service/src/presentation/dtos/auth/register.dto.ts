import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator"

/**
 * Register DTO
 * Data Transfer Object for registration requests
 * Following Clean Architecture - Presentation layer
 */
export class RegisterDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: "User password",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({
    description: "User first name",
    example: "John",
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  firstName: string

  @ApiProperty({
    description: "User last name",
    example: "Doe",
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  lastName: string
}
