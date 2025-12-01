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

  async findByUserId(userId: string): Promise<Profile[]> {
    const profiles = await this.profileModel.find({ userId }).exec();
    return profiles.map((p) => this.toDomain(p));
  }

  async findById(id: string): Promise<Profile | null> {
    const profile = await this.profileModel.findById(id).exec();
    return profile ? this.toDomain(profile) : null;
  }

  async create(profile: Profile): Promise<Profile> {
    const newProfile = new this.profileModel({
      _id: profile.id,
      userId: profile.userId,
      name: profile.name,
      iconUrl: profile.iconUrl,
      tasteProfile: profile.tasteProfile,
      favorites: profile.favorites,
      watchLater: profile.watchLater,
      history: profile.history,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    });
    
    const saved = await newProfile.save();
    return this.toDomain(saved);
  }

  async update(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const updated = await this.profileModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.profileModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async addToFavorites(profileId: string, mediaId: string): Promise<Profile | null> {
    const updated = await this.profileModel.findByIdAndUpdate(
      profileId, 
      { $addToSet: { favorites: mediaId } },
      { new: true }
    ).exec();
    return updated ? this.toDomain(updated) : null;
  }

  async removeFromFavorites(profileId: string, mediaId: string): Promise<Profile | null> {
    const updated = await this.profileModel.findByIdAndUpdate(
      profileId, 
      { $pull: { favorites: mediaId } },
      { new: true }
    ).exec();
    return updated ? this.toDomain(updated) : null;
  }

  async addToWatchLater(profileId: string, mediaId: string): Promise<Profile | null> {
    const updated = await this.profileModel.findByIdAndUpdate(
      profileId, 
      { $addToSet: { watchLater: mediaId } },
      { new: true }
    ).exec();
    return updated ? this.toDomain(updated) : null;
  }
  
  async removeFromWatchLater(profileId: string, mediaId: string): Promise<Profile | null> {
    const updated = await this.profileModel.findByIdAndUpdate(
      profileId, 
      { $pull: { watchLater: mediaId } },
      { new: true }
    ).exec();
    return updated ? this.toDomain(updated) : null;
  }

  async addToHistory(profileId: string, mediaId: string): Promise<Profile | null> {
    const historyItem = { mediaId, watchedAt: new Date() };
    const updated = await this.profileModel.findByIdAndUpdate(
      profileId, 
      { $push: { history: historyItem } },
      { new: true }
    ).exec();
    return updated ? this.toDomain(updated) : null;
  }

  private toDomain(doc: ProfileDocument): Profile {
    return new Profile(
      doc._id.toString(),
      doc.userId,
      doc.name,
      doc.iconUrl,
      doc.tasteProfile || [],
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