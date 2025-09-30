import { Injectable, NotFoundException, BadRequestException, Inject } from "@nestjs/common";
import { IUserRepository, USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { User } from "../../../domain/entities/user.entity";
import { EventPublisher } from "../../services/event-publisher.service";

@Injectable()
export class UpdatePointsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(userId: string, pointsChange: number, reason: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const currentPoints = user.currentPoints + pointsChange;
    if (currentPoints < 0) {
      throw new BadRequestException("Insufficient points balance");
    }

    const updatedUser = await this.userRepository.update(userId, { currentPoints: currentPoints });
    if (!updatedUser) {
      throw new NotFoundException("Failed to update user points");
    }

    await this.eventPublisher.publishPointsUpdated({
      userId,
      previousPoints: user.currentPoints,
      currentPoints,
      change: pointsChange,
      reason,
      timestamp: new Date(),
    });

    return updatedUser;
  }
}