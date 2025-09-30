import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"

/**
 * JWT Strategy
 * Handles JWT token validation
 * Following Clean Architecture - Presentation layer
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    })
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    }
  }
}
