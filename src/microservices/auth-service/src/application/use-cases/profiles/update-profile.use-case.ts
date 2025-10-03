import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface";
import { Profile } from "../../../domain/entities/profile.entity";

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY) 
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(
    id: string, 
    updates: Partial<Pick<Profile, "name" | "iconUrl">>,
  ): Promise<Profile> {
    if (!updates || (Object.keys(updates).length === 0)) {
      throw new BadRequestException("No valid fields provided for update");
    }

    // Siempre actualizamos la fecha de modificación
    const updatedProfile = await this.profileRepository.update(id, {
      ...updates,
      updatedAt: new Date(),
    });

    if (!updatedProfile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    return updatedProfile;
  }
}
