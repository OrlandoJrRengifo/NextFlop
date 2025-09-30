import { v4 as uuidv4 } from "uuid";
import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";
import { CreateMediaDto } from "../../dto/media.dto";
import { Media } from "../../../domain/entities/media.entity";

export class CreateMediaUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(dto: CreateMediaDto) {
    //const id = uuidv4(); lo pone mongo
    const media = new Media(
      dto.title,
      dto.description,
      dto.type,
      dto.genres.map(g => g.toLowerCase()),
      dto.rating ?? 0,
      dto.maturityRating,
      dto.releaseYear ?? new Date().getFullYear(),
      dto.duration,
      dto.posterUrl,
      dto.trailerUrl,
      dto.isActive ?? true,
    );
    const created = await this.repo.create({
      title: media.title,
      description: media.description,
      type: media.type,
      genres: media.genres,
      rating: media.rating,
      maturityRating: media.maturityRating,
      releaseYear: media.releaseYear,
      duration: media.duration,
      posterUrl: media.posterUrl,
      trailerUrl: media.trailerUrl,
      isActive: media.isActive,
      viewCount: media.viewCount,
      averageRating: media.averageRating,
      totalRatings: media.totalRatings,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    } as any);
    return created;
  }
}
