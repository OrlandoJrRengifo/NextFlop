import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";

export class FindPopularUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(limit = 10) {
    return this.repo.findPopular(limit);
  }
}
