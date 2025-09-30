import { Types } from "mongoose"

export class Media {
  constructor(
    public  title: string,
    public  description: string,
    public  type: MediaType,
    public  genres: string[],
    public  rating: number,
    public  maturityRating: string,
    public  releaseYear: number,
    public  duration: number, // in minutes
    public  posterUrl: string,
    public  trailerUrl?: string,
    //public readonly externalUrls: ExternalUrls = new ExternalUrls(),
    //public readonly cast: CastMember[] = [],
    //public readonly director?: string,
    //public readonly language: string = "en",
    //public readonly subtitles: string[] = [],
    public readonly isActive: boolean = true,
    public readonly viewCount: number = 0,
    public readonly averageRating: number = 0,
    public readonly totalRatings: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public id?: string, 
  ) {}

  // Business logic methods
  public isMovie(): boolean {
    return this.type === MediaType.MOVIE
  }

  public isSeries(): boolean {
    return this.type === MediaType.SERIES
  }

  public isDocumentary(): boolean {
    return this.type === MediaType.DOCUMENTARY
  }

  public hasGenre(genre: string): boolean {
    return this.genres.includes(genre.toLowerCase())
  }

  public isAppropriateForAge(userAge: number): boolean {
    const ageRatings = {
      G: 0,
      PG: 8,
      "PG-13": 13,
      R: 17,
      "NC-17": 18,
    }

    const requiredAge = ageRatings[this.maturityRating] || 18
    return userAge >= requiredAge
  }

  public getDurationInHours(): string {
    const hours = Math.floor(this.duration / 60)
    const minutes = this.duration % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  public incrementViewCount(): Media {
    return new Media(
      //this.id,
      this.title,
      this.description,
      this.type,
      this.genres,
      this.rating,
      this.maturityRating,
      this.releaseYear,
      this.duration,
      this.posterUrl,
      this.trailerUrl,
      //this.externalUrls,
      //this.cast,
      //this.director,
      //this.language,
      //this.subtitles,
      this.isActive,
      this.viewCount + 1,
      this.averageRating,
      this.totalRatings,
      this.createdAt,
      new Date(),
    )
  }

  public updateRating(newRating: number): Media {
    const totalScore = this.averageRating * this.totalRatings + newRating
    const newTotalRatings = this.totalRatings + 1
    const newAverageRating = totalScore / newTotalRatings

    return new Media(
      //this.id,
      this.title,
      this.description,
      this.type,
      this.genres,
      this.rating,
      this.maturityRating,
      this.releaseYear,
      this.duration,
      this.posterUrl,
      this.trailerUrl,
      //this.externalUrls,
      //this.cast,
      //this.director,
      //this.language,
      //this.subtitles,
      this.isActive,
      this.viewCount,
      Math.round(newAverageRating * 10) / 10, // Redondear a un decimal
      newTotalRatings,
      this.createdAt,
      new Date(),
    )
  }

  public isNewRelease(): boolean {
    const currentYear = new Date().getFullYear()
    return currentYear - this.releaseYear <= 1
  }

  // depende lo que consideremos popular despues
  public isPopular(): boolean {
    return this.viewCount > 1000 && this.averageRating >= 4.0
  }

  /*public hasSubtitlesFor(language: string): boolean {
    return this.subtitles.includes(language.toLowerCase())
  }*/
}

export enum MediaType {
  MOVIE = "movie",
  SERIES = "series",
  DOCUMENTARY = "documentary",
}

export class ExternalUrls {
  constructor(
    public readonly imdbUrl?: string,
    public readonly tmdbUrl?: string,
    public readonly rottenTomatoesUrl?: string,
  ) {}
}

export class CastMember {
  constructor(
    public readonly name: string,
    public readonly character: string,
    public readonly profileImageUrl?: string,
  ) {}
}
