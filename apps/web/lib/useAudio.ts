"use client";

import { useEffect, useRef } from "react";
import type { EpisodeInfo } from "@/stores/player";

export function useAudio(config: {
  currentEpisode: EpisodeInfo | null;
  status: string;
  playbackRate: number;
  currentTime: number;
  seek: (t: number) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setStatus: (s: "idle" | "playing" | "paused") => void;
  onEnded: () => void;
}) {
  const {
    currentEpisode,
    status,
    playbackRate,
    currentTime,
    seek,
    setCurrentTime,
    setDuration,
    setStatus,
    onEnded,
  } = config;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentEpisode) return;
    const audio = new Audio(currentEpisode.audioUrl);
    audioRef.current = audio;
    audio.playbackRate = playbackRate;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEndedHandler = () => onEnded();
    if (currentTime > 0) audio.currentTime = currentTime;
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEndedHandler);
    audio.addEventListener("play", () => setStatus("playing"));
    audio.addEventListener("pause", () => setStatus("paused"));
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEndedHandler);
      audioRef.current = null;
    };
  }, [currentEpisode?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || status !== "playing") return;
    audio.play().catch(() => setStatus("paused"));
  }, [status, currentEpisode?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const diff = Math.abs(audio.currentTime - currentTime);
    if (diff > 1) audio.currentTime = currentTime;
  }, [currentTime]);

  return { audioRef };
}
