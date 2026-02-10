const PROGRESS_KEY = "harrylistenly_progress";
const HISTORY_KEY = "harrylistenly_history";
const FAVORITES_KEY = "harrylistenly_favorites";
const HISTORY_MAX = 100;

export interface StoredProgress {
  albumId: string;
  albumTitle: string;
  episodeId: string;
  episodeTitle: string;
  currentTime: number;
  duration: number;
  updatedAt: string;
}

export interface HistoryItem {
  albumId: string;
  albumTitle: string;
  cover?: string;
  episodeId: string;
  episodeTitle: string;
  playedAt: string;
}

export interface FavoriteItem {
  albumId: string;
  title: string;
  author: string;
  cover: string;
  addedAt: string;
}

export function getLocalProgress(): StoredProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLocalProgress(p: StoredProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }));
  } catch {
    // ignore
  }
}

export function getLocalHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addLocalHistory(item: Omit<HistoryItem, "playedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalHistory().filter(
      (x) => !(x.albumId === item.albumId && x.episodeId === item.episodeId)
    );
    list.unshift({ ...item, playedAt: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch {
    // ignore
  }
}

export function getLocalFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addLocalFavorite(item: Omit<FavoriteItem, "addedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalFavorites().filter((x) => x.albumId !== item.albumId);
    list.unshift({ ...item, addedAt: new Date().toISOString() });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function removeLocalFavorite(albumId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalFavorites().filter((x) => x.albumId !== albumId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function isLocalFavorite(albumId: string): boolean {
  return getLocalFavorites().some((x) => x.albumId === albumId);
}
