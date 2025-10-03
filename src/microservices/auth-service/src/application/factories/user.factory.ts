import { User } from "../../domain/entities/user.entity";
import { v4 as uuidv4 } from "uuid";

export class UserFactory {
  createFromRegistration(
    fullName: string,
    email: string,
    hashedPassword: string,
  ): User {
    return new User(
      uuidv4(),
      fullName,
      new Date(),  
      email,
      hashedPassword,
      0,
      new Date(),
      new Date(),
    );
  }
}
