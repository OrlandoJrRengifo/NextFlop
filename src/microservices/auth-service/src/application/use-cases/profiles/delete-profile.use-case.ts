import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface";

@Injectable()
export class DeleteProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const deleted = await this.profileRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    return { message: `Profile with id ${id} deleted successfully` };
  }
}
