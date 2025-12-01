// src/services/favorites.ts

export interface FavoriteItem {
  id: string;
  title: string;
  image?: string;        // 👈 igual que WatchLater
  rating?: number;
  addedDate?: string;
}

const STORAGE_KEY = "favorites";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteItem[];
  } catch (e) {
    console.error("Error leyendo favorites:", e);
    return [];
  }
}

export function addFavorite(item: Omit<FavoriteItem, "addedDate">): void {
  if (typeof window === "undefined") return;

  const current = getFavorites();

  // si ya existe, no duplicar
  if (current.some((f) => f.id === item.id)) return;

  const newItem: FavoriteItem = {
    ...item,
    addedDate: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, newItem]));
}

export function removeFavorite(id: string): void {
  if (typeof window === "undefined") return;

  const current = getFavorites();
  const filtered = current.filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function isFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getFavorites();
  return current.some((f) => f.id === id);
}
