import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";

export class ListMediaUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(limit = 20, offset = 0) {
    return this.repo.findAll(limit, offset);
  }
}
