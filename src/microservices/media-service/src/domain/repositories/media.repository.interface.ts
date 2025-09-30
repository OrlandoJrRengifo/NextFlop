import type { Media, MediaType } from "../entities/media.entity"
export interface IMediaRepository {
  findById(id: string): Promise<Media | null>
  findByTitle(title: string): Promise<Media[]>
  findByGenre(genre: string): Promise<Media[]>
  findByType(type: MediaType): Promise<Media[]>
  findByYear(year: number): Promise<Media[]>
  findByRatingRange(minRating: number, maxRating: number): Promise<Media[]>
  findPopular(limit?: number): Promise<Media[]>
  findNewReleases(limit?: number): Promise<Media[]>
  findRecommended(genres: string[], limit?: number): Promise<Media[]>
  search(query: string, filters?: MediaSearchFilters): Promise<Media[]>
  create(media: Omit<Media, "id" | "createdAt" | "updatedAt">): Promise<Media>
  update(id: string, media: Partial<Media>): Promise<Media | null>
  delete(id: string): Promise<boolean>
  findAll(limit?: number, offset?: number): Promise<{ media: Media[]; total: number }>
  incrementViewCount(id: string): Promise<Media | null>
  updateRating(id: string, rating: number): Promise<Media | null>
  findSimilar(mediaId: string, limit?: number): Promise<Media[]>
  countByGenre(genre: string): Promise<number>
  getTotalCount(): Promise<number>
}

export interface MediaSearchFilters {
  genres?: string[]
  type?: MediaType
  minYear?: number
  maxYear?: number
  minRating?: number
  maxRating?: number
  maturityRating?: string[]
  language?: string
  minDuration?: number
  maxDuration?: number
  offset?: number
  limit?: number
}
