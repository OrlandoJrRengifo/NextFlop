import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "User ID" })
  id: string;

  @ApiProperty({ description: "User email" })
  email: string;

  @ApiProperty({ description: "User full name" })
  fullName: string;

  @ApiProperty({ description: "User current points balance" })
  currentPoints: number;
}

export class AuthResponseDto {
  @ApiProperty({ description: "User information", type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: "JWT access token" })
  accessToken: string;
}