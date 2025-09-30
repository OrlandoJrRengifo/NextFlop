import { Injectable } from "@nestjs/common";
import { MediaRepository } from "../../../infrastructure/repositories/media.repository";

@Injectable()
export class UpdateRatingUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(mediaId: string, rate: number) {
    return this.mediaRepository.updateRating(mediaId, rate);
  }
}
