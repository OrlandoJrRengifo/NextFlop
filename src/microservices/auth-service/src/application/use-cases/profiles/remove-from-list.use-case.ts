import { Inject, Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface";
import { Profile } from "../../../domain/entities/profile.entity";

@Injectable()
export class RemoveFromListUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY) 
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(
    profileId: string, 
    listType: 'favorites' | 'watchLater', 
    mediaId: string
  ): Promise<Profile> {
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException(`Profile with id ${profileId} not found`);
    }
    
    let updatedProfile: Profile | null;

    switch (listType) {
      case 'favorites':
        updatedProfile = await this.profileRepository.removeFromFavorites(profileId, mediaId);
        break;
      case 'watchLater':
        updatedProfile = await this.profileRepository.removeFromWatchLater(profileId, mediaId);
        break;
      default:
        throw new BadRequestException('Invalid list type specified');
    }

    if (!updatedProfile) {
      throw new InternalServerErrorException('Could not update profile list');
    }

    return updatedProfile;
  }
}
