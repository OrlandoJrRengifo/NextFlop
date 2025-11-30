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
    fullName: string,
    birthDate?: string,
    plan?: string,
    payment?: { cardNumber?: string; expiryDate?: string; cvv?: string; cardName?: string },
    paymentLast4?: string,
  ): Promise<{ user: User; accessToken: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Obtener last4 de la tarjeta (mock). Preferir paymentLast4 si fue provisto por endpoint de pagos.
    const derivedLast4 = payment?.cardNumber ? payment.cardNumber.slice(-4) : undefined;
    const finalLast4 = paymentLast4 ?? derivedLast4;

    const birth = birthDate ? new Date(birthDate) : undefined;

    const user = this.userFactory.createFromRegistration(
      fullName,
      email,
      hashedPassword,
      birth,
      plan,
      finalLast4,
    );

    const savedUser = await this.userRepository.create(user);

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
    };

    const accessToken = this.jwtService.sign(payload);

    return { user: savedUser, accessToken };
  }
}
