import { Body, Controller, Post, HttpException, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "../../auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@ApiTags("Onboarding")
@Controller("api/onboarding")
export class OnboardingController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post("complete")
  @ApiOperation({ summary: "Complete user registration with subscription" })
  @ApiResponse({ status: 201, description: "Registration completed successfully" })
  async complete(@Body() dto: any) {
    try {
      if (!dto.user || !dto.user.email || !dto.user.password) {
        throw new HttpException("User data is required", HttpStatus.BAD_REQUEST);
      }

      const user = await this.authService.register({
        email: dto.user.email,
        password: dto.user.password,
        name: dto.user.fullName,
      });

      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return {
        user,
        accessToken,
        message: "Registration completed. Please complete subscription on the subscriptions service.",
      };
    } catch (error: any) {
      throw new HttpException(error.message || "Registration failed", HttpStatus.BAD_REQUEST);
    }
  }
}
