import { create } from "zustand";

export interface EpisodeInfo {
  id: string;
  albumId: string;
  title: string;
  duration: number;
  audioUrl: string;
  order: number;
}

interface PlayerState {
  albumId: string | null;
  albumTitle: string | null;
  currentEpisode: EpisodeInfo | null;
  queue: EpisodeInfo[];
  status: "idle" | "playing" | "paused";
  currentTime: number;
  duration: number;
  playbackRate: number;
  setEpisode: (
    albumId: string,
    albumTitle: string,
    episode: EpisodeInfo,
    queue?: EpisodeInfo[]
  ) => void;
  play: () => void;
  pause: () => void;
  seek: (t: number) => void;
  setRate: (r: number) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setStatus: (s: "idle" | "playing" | "paused") => void;
  reset: () => void;
}

function getRestoredTime(albumId: string, episodeId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("harrylistenly_progress");
    if (!raw) return 0;
    const p = JSON.parse(raw);
    if (p.albumId === albumId && p.episodeId === episodeId && typeof p.currentTime === "number") {
      return Math.min(Math.max(0, p.currentTime), (p.duration || 0) > 0 ? p.duration : Infinity);
    }
  } catch {
    // ignore
  }
  return 0;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  albumId: null,
  albumTitle: null,
  currentEpisode: null,
  queue: [],
  status: "idle",
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  setEpisode: (albumId, albumTitle, episode, queue) => {
    const restored = getRestoredTime(albumId, episode.id);
    set({
      albumId,
      albumTitle,
      currentEpisode: episode,
      queue: queue ?? [],
      status: "idle",
      currentTime: restored,
      duration: episode.duration,
    });
  },
  play: () => set({ status: "playing" }),
  pause: () => set({ status: "paused" }),
  seek: (currentTime) => set({ currentTime }),
  setRate: (playbackRate) => set({ playbackRate }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setStatus: (status) => set({ status }),
  reset: () =>
    set({
      albumId: null,
      albumTitle: null,
      currentEpisode: null,
      queue: [],
      status: "idle",
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
    }),
}));
