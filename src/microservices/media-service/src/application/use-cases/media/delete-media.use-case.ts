import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";

export class DeleteMediaUseCase {
  constructor(private readonly repo: IMediaRepository) {}
  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Media not found");
    return this.repo.delete(id);
  }
}
