import { Injectable, ConflictException, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { USER_REPOSITORY, IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { User } from "../../../domain/entities/user.entity";
import { UserFactory } from "../../factories/user.factory";

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly userFactory: UserFactory,
  ) {}

  async execute(
    email: string,
    password: string,
    fullName: string, // Se cambia firstName y lastName por fullName
  ): Promise<{ user: User; accessToken: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Se llama a la versión corregida de la fábrica
    const user = this.userFactory.createFromRegistration(
      fullName,
      email,
      hashedPassword,
    );

    const savedUser = await this.userRepository.create(user);

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName, // Se usa fullName
    };
    const accessToken = this.jwtService.sign(payload);

    return { user: savedUser, accessToken };
  }
}