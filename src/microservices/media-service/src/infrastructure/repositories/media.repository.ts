import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { Media as MediaEntity, MediaType } from "../../domain/entities/media.entity";
import { IMediaRepository, MediaSearchFilters } from "../../domain/repositories/media.repository.interface";
import { Media as MediaDocument } from "../database/schemas/media.schema";

@Injectable()
export class MediaRepository implements IMediaRepository {
  constructor(
    @InjectModel(MediaDocument.name)
    private mediaModel: Model<MediaDocument>,
  ) { }

  private toDomain(doc: MediaDocument): MediaEntity {
    return new (require("../../domain/entities/media.entity").Media)(
      doc.title,
      doc.description,
      doc.type as MediaType,
      doc.genres,
      doc.rating ?? 0,
      doc.maturityRating,
      doc.releaseYear,
      doc.duration,
      doc.posterUrl,
      doc.trailerUrl,
      doc.isActive ?? true,
      doc.viewCount ?? 0,
      doc.averageRating ?? 0,
      doc.totalRatings ?? 0,
      doc.createdAt,
      doc.updatedAt,
      doc._id.toString()
    );
  }


  async findById(id: string): Promise<MediaEntity | null> {
    const doc = await this.mediaModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByTitle(title: string): Promise<MediaEntity[]> {
    const docs = await this.mediaModel.find({ title: new RegExp(title, "i") }).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findByGenre(genre: string): Promise<MediaEntity[]> {
    const docs = await this.mediaModel.find({ genres: genre.toLowerCase() }).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findByType(type: MediaType): Promise<MediaEntity[]> {
    const docs = await this.mediaModel.find({ type }).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findByYear(year: number): Promise<MediaEntity[]> {
    const docs = await this.mediaModel.find({ releaseYear: year }).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findByRatingRange(minRating: number, maxRating: number): Promise<MediaEntity[]> {
    const docs = await this.mediaModel.find({ averageRating: { $gte: minRating, $lte: maxRating } }).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findPopular(limit = 10): Promise<MediaEntity[]> {
    const docs = await this.mediaModel.find({ isActive: true }).sort({ viewCount: -1, averageRating: -1 }).limit(limit).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findNewReleases(limit = 10): Promise<MediaEntity[]> {
    const currentYear = new Date().getFullYear();
    const docs = await this.mediaModel.find({ releaseYear: { $gte: currentYear - 1 }, isActive: true }).sort({ releaseYear: -1 }).limit(limit).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findRecommended(genres: string[], limit = 10): Promise<MediaEntity[]> {
    const lower = genres.map((g) => g.toLowerCase());
    const docs = await this.mediaModel.find({ genres: { $in: lower }, isActive: true }).sort({ averageRating: -1, viewCount: -1 }).limit(limit).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async search(query: string, filters?: MediaSearchFilters): Promise<MediaEntity[]> {
    const match: any = {}

    // texto sobre title y description
    if (query && query.trim().length > 0) {
      const re = new RegExp(query.trim(), "i")
      match.$or = [{ title: re }, { description: re }]
    }

    // genres (asegurar lower-case)
    if (filters?.genres && filters.genres.length) {
      match.genres = { $in: filters.genres.map(g => g.toLowerCase()) }
    }

    // type
    if (filters?.type) match.type = filters.type

    // releaseYear range
    if (typeof filters?.minYear === "number" || typeof filters?.maxYear === "number") {
      match.releaseYear = {}
      if (typeof filters.minYear === "number") match.releaseYear.$gte = Number(filters.minYear)
      if (typeof filters.maxYear === "number") match.releaseYear.$lte = Number(filters.maxYear)
    }

    const offset = filters?.offset ?? 0
    const limit = filters?.limit ?? 20

    // pipeline
    const pipeline: any[] = []

    // 1) initial match (non-rating filters)
    if (Object.keys(match).length) pipeline.push({ $match: match })

    // 2) compute effectiveRating: use averageRating if there are ratings, otherwise fallback to rating
    pipeline.push({
      $addFields: {
        effectiveRating: {
          $cond: [
            { $gt: ["$totalRatings", 0] },
            { $ifNull: ["$averageRating", 0] },
            { $ifNull: ["$rating", 0] }
          ]
        }
      }
    })

    // 3) rating range match (if provided)
    if (typeof filters?.minRating !== "undefined" || typeof filters?.maxRating !== "undefined") {
      const rMatch: any = {}
      if (typeof filters.minRating !== "undefined") rMatch.$gte = Number(filters.minRating)
      if (typeof filters.maxRating !== "undefined") rMatch.$lte = Number(filters.maxRating)
      pipeline.push({ $match: { effectiveRating: rMatch } })
    }

    // 4) pagination + project (ensure no mongoose doc wrappers)
    pipeline.push({ $skip: offset })
    pipeline.push({ $limit: limit })

    console.log("media.search -> pipeline:", JSON.stringify(pipeline))

    const docs = await this.mediaModel.aggregate(pipeline).exec()
    // aggregate returns plain objects, adapt to toDomain expecting MediaDocument-like object
    return docs.map((d: any) => {
      // Map aggregation result to shape compatible with toDomain
      // Ensure presence of createdAt/updatedAt and _id
      const fakeDoc: any = {
        _id: d._id,
        title: d.title,
        description: d.description,
        type: d.type,
        genres: d.genres,
        rating: d.rating,
        maturityRating: d.maturityRating,
        releaseYear: d.releaseYear,
        duration: d.duration,
        posterUrl: d.posterUrl,
        trailerUrl: d.trailerUrl,
        isActive: d.isActive,
        viewCount: d.viewCount,
        averageRating: d.averageRating,
        totalRatings: d.totalRatings,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }
      return this.toDomain(fakeDoc as MediaDocument)
    })
  }


  /*
  async search(query: string, filters?: MediaSearchFilters): Promise<MediaEntity[]> {
    const andConditions: any[] = []

    // texto sobre title y description
    if (query && query.trim().length > 0) {
      const re = new RegExp(query.trim(), "i")
      andConditions.push({ $or: [{ title: re }, { description: re }] })
    }

    // genres (asegurar lower-case)
    if (filters?.genres && filters.genres.length) {
      andConditions.push({ genres: { $in: filters.genres.map(g => g.toLowerCase()) } })
    }

    // type
    if (filters?.type) andConditions.push({ type: filters.type })

    // releaseYear range
    if (typeof filters?.minYear === "number" || typeof filters?.maxYear === "number") {
      const yearCond: any = {}
      if (typeof filters.minYear === "number") yearCond.$gte = Number(filters.minYear)
      if (typeof filters.maxYear === "number") yearCond.$lte = Number(filters.maxYear)
      andConditions.push({ releaseYear: yearCond })
    }

    // rating range -> chequear tanto averageRating como rating
    if (typeof filters?.minRating !== "undefined" || typeof filters?.maxRating !== "undefined") {
      const ratingCond: any = {}
      if (typeof filters.minRating !== "undefined") ratingCond.$gte = Number(filters.minRating)
      if (typeof filters.maxRating !== "undefined") ratingCond.$lte = Number(filters.maxRating)

      // push un OR interno que busca en averageRating o en rating
      andConditions.push({ $or: [{ averageRating: ratingCond }, { rating: ratingCond }] })
    }

    const q = andConditions.length === 0 ? {} : (andConditions.length === 1 ? andConditions[0] : { $and: andConditions })

    const offset = filters?.offset ?? 0
    const limit = filters?.limit ?? 20

    console.log("media.search -> query:", JSON.stringify(q), "offset:", offset, "limit:", limit)

    const docs = await this.mediaModel.find(q).skip(offset).limit(limit).exec()
    return docs.map(d => this.toDomain(d))
  }
*/

  async create(mediaData: Omit<MediaEntity, "id" | "createdAt" | "updatedAt">): Promise<MediaEntity> {
    const doc = new this.mediaModel({
      ...mediaData,
      genres: mediaData.genres.map((g) => g.toLowerCase()),
    });
    const saved = await doc.save();
    return this.toDomain(saved);
  }

  async update(id: string, mediaPartial: Partial<MediaEntity>): Promise<MediaEntity | null> {
    if (mediaPartial.genres) mediaPartial.genres = mediaPartial.genres.map((g: string) => g.toLowerCase() as any);
    const doc = await this.mediaModel.findByIdAndUpdate(id, mediaPartial, { new: true }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.mediaModel.findByIdAndDelete(id).exec();
    return !!res;
  }

  async findAll(limit = 20, offset = 0): Promise<{ media: MediaEntity[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.mediaModel.find().skip(offset).limit(limit).exec(),
      this.mediaModel.countDocuments().exec(),
    ]);
    return { media: docs.map((d) => this.toDomain(d)), total };
  }

  async incrementViewCount(id: string): Promise<MediaEntity | null> {
    const doc = await this.mediaModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async updateRating(mediaId: string, rate: number): Promise<any> {
    if (isNaN(rate)) {
      throw new Error("Invalid rate value, must be a number");
    }

    const media = await this.mediaModel.findById(mediaId);
    if (!media) throw new Error("Media not found");

    media.totalRatings = (media.totalRatings || 0) + 1;
    media.averageRating =
      ((media.averageRating || 0) * (media.totalRatings - 1) + rate) /
      media.totalRatings;

    await media.save();
    return media;
  }


  async findSimilar(mediaId: string, limit = 10): Promise<MediaEntity[]> {
    const base = await this.mediaModel.findById(mediaId).exec();
    if (!base) return [];
    const docs = await this.mediaModel.find({
      _id: { $ne: base._id },
      genres: { $in: base.genres },
    }).sort({ viewCount: -1, averageRating: -1 }).limit(limit).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async countByGenre(genre: string): Promise<number> {
    return await this.mediaModel.countDocuments({ genres: genre.toLowerCase() }).exec();
  }

  async getTotalCount(): Promise<number> {
    return await this.mediaModel.countDocuments().exec();
  }
}
