// src/domain/repositories/profile.repository.interface.ts

import { Profile } from "../entities/profile.entity";

export type CreateProfileData = Omit<Profile, "id" | "createdAt" | "updatedAt">;

export const PROFILE_REPOSITORY = "IProfileRepository"; // Cambiado a string para consistencia

export interface IProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile[]>;
  create(profile: CreateProfileData): Promise<Profile>;
  update(id: string, profile: Partial<Profile>): Promise<Profile | null>;
  delete(id: string): Promise<boolean>;
  
  // Métodos de listas añadidos
  addToFavorites(profileId: string, mediaId: string): Promise<Profile | null>;
  removeFromFavorites(profileId: string, mediaId: string): Promise<Profile | null>;
  addToWatchLater(profileId: string, mediaId: string): Promise<Profile | null>;
  removeFromWatchLater(profileId: string, mediaId: string): Promise<Profile | null>;
  addToHistory(profileId: string, mediaId: string): Promise<Profile | null>;
}