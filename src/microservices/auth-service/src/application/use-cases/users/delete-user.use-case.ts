import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { USER_REPOSITORY, IUserRepository } from "../../../domain/repositories/user.repository.interface";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<{ message: string }> {
    const deleted = await this.userRepository.delete(userId);

    if (!deleted) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return { message: `User with id ${userId} deleted successfully` };
  }
}
