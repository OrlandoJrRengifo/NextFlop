import { User } from "../../domain/entities/user.entity";
import { v4 as uuidv4 } from "uuid";

export class UserFactory {
  createFromRegistration(
    fullName: string,
    email: string,
    hashedPassword: string,
    birthDate: Date,   // <-- ahora es Date, no string
  ): User {
    return new User(
      uuidv4(),
      fullName,
      birthDate,       // <-- ya viene convertido en el UseCase
      email,
      hashedPassword,
      0,               // currentPoints
      new Date(),
      new Date(),
    );
  }
}
