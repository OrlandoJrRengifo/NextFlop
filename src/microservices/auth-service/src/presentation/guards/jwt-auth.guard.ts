import { Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

/**
 * JWT Auth Guard
 * Protects routes with JWT authentication
 * Following Clean Architecture - Presentation layer
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
