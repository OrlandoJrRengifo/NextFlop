import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";
import { UpdateMediaDto } from "../../dto/media.dto";

export class UpdateMediaUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(id: string, dto: UpdateMediaDto) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("Media not found");

    const payload: Partial<any> = {};
    Object.assign(payload, dto);
    if (payload.genres) payload.genres = payload.genres.map((g: string) => g.toLowerCase());

    return this.repo.update(id, payload);
  }
}
