export type TasteProfileItem = { genre: string; score: number };
// CAMBIO: mediaId ahora es string (UUID)
export type HistoryItem = { mediaId: string; watchedAt: Date };

export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly iconUrl: string,
    public readonly tasteProfile: TasteProfileItem[],
    // CAMBIO: Array de strings (UUIDs)
    public readonly favorites: string[],
    // CAMBIO: Array de strings (UUIDs)
    public readonly watchLater: string[],
    public readonly history: HistoryItem[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}