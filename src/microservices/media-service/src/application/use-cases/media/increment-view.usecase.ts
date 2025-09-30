import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";

export class IncrementViewCountUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(id: string) {
    return this.repo.incrementViewCount(id);
  }
}
