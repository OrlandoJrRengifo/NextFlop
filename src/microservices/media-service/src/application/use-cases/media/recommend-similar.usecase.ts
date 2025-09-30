import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";

export class FindSimilarUseCase {
  constructor(private readonly repo: IMediaRepository) {}
  async execute(mediaId: string, limit = 10) {
    return this.repo.findSimilar(mediaId, limit);
  }
}

export class FindRecommendedUseCase {
  constructor(private readonly repo: IMediaRepository) {}
  async execute(genres: string[], limit = 10) {
    return this.repo.findRecommended(genres.map(g => g.toLowerCase()), limit);
  }
}
