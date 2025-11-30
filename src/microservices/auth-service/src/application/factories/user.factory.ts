import { User } from "../../domain/entities/user.entity";
import { v4 as uuidv4 } from "uuid";

export class UserFactory {
  createFromRegistration(
    fullName: string,
    email: string,
    hashedPassword: string,
    birthDate?: Date,
    plan?: string,
    paymentLast4?: string,
  ): User {
    return new User(
      uuidv4(),
      fullName,
      birthDate ?? new Date(),
      email,
      hashedPassword,
      0,
      new Date(),
      new Date(),
      plan,
      paymentLast4,
    );
  }
}
