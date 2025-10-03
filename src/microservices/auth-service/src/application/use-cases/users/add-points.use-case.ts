import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
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
    if (!Number.isFinite(points)) {
      throw new BadRequestException("Points must be a valid number");
    }

    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException("Reason must be provided");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const previousPoints = user.currentPoints ?? 0;
    const currentPoints = previousPoints + points;

    if (currentPoints < 0) {
      throw new BadRequestException("Insufficient points balance");
    }

    const updatedUser = await this.userRepository.update(userId, {
      currentPoints,
      updatedAt: new Date(),
    });

    if (!updatedUser) {
      throw new InternalServerErrorException("Failed to update user points");
    }

    await this.eventPublisher.publishPointsUpdated({
      userId,
      previousPoints,
      currentPoints,
      change: points,
      reason,
      timestamp: new Date(),
    });

    return {
      message: "Points updated successfully",
      userId,
      previousPoints,
      currentPoints,
    };
  }
}
