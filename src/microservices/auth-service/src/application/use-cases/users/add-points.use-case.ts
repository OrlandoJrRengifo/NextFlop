import { Injectable, Inject } from "@nestjs/common";
import { USER_REPOSITORY, IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { EventPublisher } from "../../services/event-publisher.service";

@Injectable()
export class AddPointsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(userId: string, points: number, reason: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const previousPoints = user.currentPoints ?? 0;
    const currentPoints = previousPoints + points;

    const updatedUser = await this.userRepository.update(userId, {
      currentPoints: currentPoints,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user points");
    }

    await this.eventPublisher.publishPointsUpdated({
      userId,
      previousPoints,
      currentPoints,
      change: points,
      reason,
      timestamp: new Date(),
    });

    return updatedUser;
  }
}