import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common"
import { USER_REPOSITORY, IUserRepository } from "../../../domain/repositories/user.repository.interface"
import { User } from "../../../domain/entities/user.entity"

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, updateData: Partial<User>): Promise<User> {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException("No update data provided")
    }

    // 🔒 Evitamos que se actualicen campos prohibidos
    const { id, email, password, ...allowedUpdates } = updateData as any

    const updatedUser = await this.userRepository.update(userId, allowedUpdates)
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${userId} not found`)
    }

    console.log('Datos recibidos en update:', updateData);
    return this.userRepository.update(userId, updateData);
  }

}
