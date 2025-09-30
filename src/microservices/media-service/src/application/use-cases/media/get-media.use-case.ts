import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";

export class GetMediaUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(id: string) {
    const m = await this.repo.findById(id);
    if (!m) throw new Error("Media not found");
    return m;
  }
}
