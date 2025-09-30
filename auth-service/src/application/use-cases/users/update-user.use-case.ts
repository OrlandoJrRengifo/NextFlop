import { Injectable, Inject } from "@nestjs/common"
import { USER_REPOSITORY, IUserRepository } from "../../../domain/repositories/user.repository.interface"

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, updateData: any) {
    return this.userRepository.update(userId, updateData)
  }
}
