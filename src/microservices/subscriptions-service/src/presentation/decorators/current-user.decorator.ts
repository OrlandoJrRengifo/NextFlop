import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

/**
 * Current User Decorator
 * Extracts user information from JWT token
 * Following Clean Architecture - Presentation layer
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
