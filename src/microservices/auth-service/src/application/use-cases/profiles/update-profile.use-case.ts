import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface"
import { Profile } from "../../../domain/entities/profile.entity"

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY) private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(id: string, updates: Partial<Profile>): Promise<Profile> {
    const profile = await this.profileRepository.update(id, updates)
    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`)
    }
    return profile
  }
}
