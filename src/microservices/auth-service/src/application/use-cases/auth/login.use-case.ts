import { Injectable, UnauthorizedException, Inject } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { USER_REPOSITORY, IUserRepository } from "../../../domain/repositories/user.repository.interface"
import { User } from "../../../domain/entities/user.entity"

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Payload adaptado a tu modelo
    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    }

    const accessToken = this.jwtService.sign(payload)

    return { user, accessToken }
  }
}
