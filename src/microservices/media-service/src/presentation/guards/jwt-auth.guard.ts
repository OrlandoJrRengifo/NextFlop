import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}


/*import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException("Access token is required")
    }

    try {
      const payload = this.jwtService.verify(token)
      request.user = payload
      return true
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token")
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
*/