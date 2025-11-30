import { Inject, Injectable } from "@nestjs/common";
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface";
import { Profile } from "../../../domain/entities/profile.entity";

@Injectable()
export class ListProfilesUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string): Promise<Profile[]> {
    return this.profileRepository.findByUserId(userId);
  }
}
