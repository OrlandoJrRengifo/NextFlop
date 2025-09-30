import { Injectable } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UserFactory {
  create(userData: {
    fullName: string;
    birthDate: Date;
    email: string;
    password: string;
    currentPoints?: number;
  }): User {
    return new User(
      uuidv4(), // id único
      userData.fullName,
      userData.birthDate,
      userData.email,
      userData.password,
      userData.currentPoints ?? 0,
      new Date(), // createdAt
      new Date(), // updatedAt
    );
  }

  createFromRegistration(
    fullName: string,
    email: string,
    hashedPassword: string,
  ): User {
    return new User(
      uuidv4(),
      fullName,
      null, // birthDate no se pide en el registro
      email,
      hashedPassword,
      100, // Bonus de bienvenida para currentPoints
      new Date(),
      new Date(),
    );
  }
}