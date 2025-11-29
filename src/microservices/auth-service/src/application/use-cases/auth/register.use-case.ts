// src/application/use-cases/auth/register.use-case.ts

import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import {
  USER_REPOSITORY,
  IUserRepository,
} from "../../../domain/repositories/user.repository.interface";
import { UserFactory } from "../../factories/user.factory";
import { User } from "../../../domain/entities/user.entity";

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly userFactory: UserFactory,
  ) {}

  async execute(dto: {
    email: string;
    password: string;
    fullName: string;
    birthDate: string; // llega como texto desde el frontend
  }): Promise<{ user: User; accessToken: string }> {

    const { email, password, fullName, birthDate } = dto;

    // --- Validar email duplicado ---
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // --- Hash de contraseña ---
    const hashedPassword = await bcrypt.hash(password, 12);

    // Convertir fecha string → Date
    const parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      throw new ConflictException("Invalid birthDate format");
    }

    // --- Crear entidad User ---
    const user = this.userFactory.createFromRegistration(
      fullName,
      email,
      hashedPassword,
      parsedBirthDate,
    );

    // --- Guardar ---
    const savedUser = await this.userRepository.create(user);

    // --- Firmar token ---
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
    };

    const accessToken = this.jwtService.sign(payload);

    return { user: savedUser, accessToken };
  }
}
