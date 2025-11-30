import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProfileRepository } from "../../domain/repositories/profile.repository.interface";
import { Profile } from "../../domain/entities/profile.entity";
import { ProfileDocument, ProfileSchema } from "../database/schemas/profile.schema";

@Injectable()
export class ProfileRepository implements IProfileRepository {
  private readonly logger = new Logger(ProfileRepository.name);

  constructor(
    @InjectModel(ProfileDocument.name) 
    private readonly profileModel: Model<ProfileDocument>
  ) {}

  async create(profileData: Omit<Profile, "id" | "createdAt" | "updatedAt">): Promise<Profile> {
    // Si la entidad viene sin ID, Mongo generará un ObjectId, pero tu arquitectura parece esperar UUIDs.
    // Asumiremos que el ID se maneja antes o que aceptamos el de Mongo casteado a string.
    const profile = new this.profileModel(profileData);
    const saved = await profile.save();
    return this.mapToEntity(saved);
  }

  async findById(id: string): Promise<Profile | null> {
    const profile = await this.profileModel.findById(id).exec();
    return profile ? this.mapToEntity(profile) : null;
  }

  async findByUserId(userId: string): Promise<Profile[]> {
    const profiles = await this.profileModel.find({ userId }).exec();
    return profiles.map((doc) => this.mapToEntity(doc));
  }

  async update(id: string, updateData: Partial<Profile>): Promise<Profile | null> {
    const updated = await this.profileModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return updated ? this.mapToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.profileModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async addToFavorites(profileId: string, mediaId: string): Promise<Profile | null> {
    return this.update(profileId, { $addToSet: { favorites: mediaId } } as any);
  }

  async removeFromFavorites(profileId: string, mediaId: string): Promise<Profile | null> {
    return this.update(profileId, { $pull: { favorites: mediaId } } as any);
  }

  async addToWatchLater(profileId: string, mediaId: string): Promise<Profile | null> {
    return this.update(profileId, { $addToSet: { watchLater: mediaId } } as any);
  }
  
  async removeFromWatchLater(profileId: string, mediaId: string): Promise<Profile | null> {
    return this.update(profileId, { $pull: { watchLater: mediaId } } as any);
  }

  async addToHistory(profileId: string, mediaId: string): Promise<Profile | null> {
    const historyItem = { mediaId, watchedAt: new Date() };
    return this.update(profileId, { $push: { history: historyItem } } as any);
  }

  private mapToEntity(doc: ProfileDocument): Profile {
    // Mapeo seguro a la Entidad
    return new Profile(
      doc._id.toString(),
      doc.userId,
      doc.name,
      doc.iconUrl,
      doc.tasteProfile || [],
      // Aseguramos que sean arrays de strings
      (doc.favorites || []).map(f => f.toString()),
      (doc.watchLater || []).map(w => w.toString()),
      (doc.history || []).map(h => ({
        mediaId: h.mediaId.toString(),
        watchedAt: h.watchedAt
      })),
      doc.createdAt,
      doc.updatedAt
    );
  }
}