import { Inject, Injectable } from "@nestjs/common";
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface";
import { Profile } from "../../../domain/entities/profile.entity";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY) private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(data: { userId: string; name: string; iconUrl?: string }): Promise<Profile> {
    const profile = new Profile(
      uuidv4(), // id
      data.userId,
      data.name,
      data.iconUrl || "",
      [], // tasteProfile
      [], // favorites
      [], // watchLater
      [], // history
      new Date(), // createdAt
      new Date(), // updatedAt
    );
    return this.profileRepository.create(profile);
  }
}