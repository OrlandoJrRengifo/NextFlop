import { Inject, Injectable } from "@nestjs/common";
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface";
import { Profile } from "../../../domain/entities/profile.entity";
import { v4 as uuidv4 } from "uuid";
import { CreateProfileDto } from "../../../presentation/dtos/profile/create-profile.dto";

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY) 
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(data: CreateProfileDto): Promise<Profile> {
    const now = new Date();

    const profile = new Profile(
      uuidv4(),
      data.userId,
      data.name,
      data.iconUrl || "",
      [],
      [],
      [],
      [],
      now,
      now,
    );

    return this.profileRepository.create(profile);
  }
}
