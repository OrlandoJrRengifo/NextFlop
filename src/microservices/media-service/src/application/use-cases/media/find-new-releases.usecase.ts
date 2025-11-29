import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";

export class FindNewReleasesUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(limit = 10) {
    return this.repo.findNewReleases(limit);
  }
}
