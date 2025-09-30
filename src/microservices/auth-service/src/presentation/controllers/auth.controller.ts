import { Controller, Post, HttpCode, HttpStatus, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case";
import { LoginDto } from "../dtos/auth/login.dto";
import { RegisterDto } from "../dtos/auth/register.dto";
import { AuthResponseDto } from "../dtos/auth/auth-response.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful", type: AuthResponseDto })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute(loginDto.email, loginDto.password);
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        currentPoints: result.user.currentPoints,
      },
      accessToken: result.accessToken,
    };
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: "Registration successful", type: AuthResponseDto })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const result = await this.registerUseCase.execute(
      registerDto.email,
      registerDto.password,
      `${registerDto.firstName} ${registerDto.lastName}`, // Se unen para crear fullName
    );
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        currentPoints: result.user.currentPoints,
      },
      accessToken: result.accessToken,
    };
  }
}