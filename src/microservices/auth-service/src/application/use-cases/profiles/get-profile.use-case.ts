import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface"
import { Profile } from "../../../domain/entities/profile.entity"

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY) private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findById(id)
    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`)
    }
    return profile
  }
}
