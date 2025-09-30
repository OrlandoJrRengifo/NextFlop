import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";
import { MediaSearchDto } from "../../dto/search.dto";

export class SearchMediaUseCase {
  constructor(private readonly repo: IMediaRepository) { }

  async execute(dto: MediaSearchDto) {
    return this.repo.search(dto.query ?? "", {
      genres: dto.genres,
      type: dto.type,
      minYear: dto.minYear,
      maxYear: dto.maxYear,
      minRating: typeof dto.minRating !== "undefined" ? dto.minRating : undefined,
      maxRating: typeof dto.maxRating !== "undefined" ? dto.maxRating : undefined,
      offset: dto.offset ?? 0,
      limit: dto.limit ?? 20,
    })
  }
}
