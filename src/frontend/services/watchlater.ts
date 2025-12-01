// ==========================
// WATCH LATER SERVICE (localStorage)
// ==========================

export interface WatchLaterItem {
  id: string;
  title: string;
  poster?: string;
  image?: string;
  backdrop?: string;
  duration?: string;
  addedDate?: string;
}

const KEY = "watchlater";

export function getWatchLater(): WatchLaterItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveWatchLater(list: WatchLaterItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

export function addWatchLater(item: WatchLaterItem) {
  const list = getWatchLater();

  // Evitar duplicados
  if (!list.some((f) => f.id === item.id)) {
    list.push({ ...item, addedDate: new Date().toISOString() });
    saveWatchLater(list);
  }
}

export function removeWatchLater(id: string) {
  const list = getWatchLater().filter((f) => f.id !== id);
  saveWatchLater(list);
}

export function isInWatchLater(id: string): boolean {
  return getWatchLater().some((f) => f.id === id);
}
