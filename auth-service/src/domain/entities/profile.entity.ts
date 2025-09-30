// src/domain/entities/profile.entity.ts

import { Schema as MongooseSchema } from "mongoose";

// Tipos para los datos anidados, para mayor claridad
export type TasteProfileItem = { genre: string; score: number };
export type HistoryItem = { mediaId: MongooseSchema.Types.ObjectId; watchedAt: Date };

export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly iconUrl: string,
    public readonly tasteProfile: TasteProfileItem[],
    public readonly favorites: MongooseSchema.Types.ObjectId[],
    public readonly watchLater: MongooseSchema.Types.ObjectId[],
    public readonly history: HistoryItem[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}