"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLocalProgress } from "@/lib/storage";
import { usePlayerStore } from "@/stores/player";
import { getAudioUrl } from "@/lib/audio";

export function ContinueListening() {
  const [progress, setProgress] = useState<ReturnType<typeof getLocalProgress>>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setProgress(getLocalProgress());
  }, []);

  async function handleContinue() {
    if (!progress) return;
    setLoading(true);
    try {
      const [albumRes, episodesRes] = await Promise.all([
        fetch(`/api/albums/${progress.albumId}`),
        fetch(`/api/albums/${progress.albumId}/episodes`),
      ]);
      if (!albumRes.ok || !episodesRes.ok) return;
      const album = await albumRes.json();
      const episodes = await episodesRes.json();
      const ep = episodes.find((e: { id: string }) => e.id === progress.episodeId);
      if (!ep) return;
      const queue = episodes.map((e: { id: string; albumId: string; title: string; duration: number; audioUrl: string; order: number }) => ({
        id: e.id,
        albumId: e.albumId,
        title: e.title,
        duration: e.duration,
        audioUrl: getAudioUrl(e.audioUrl),
        order: e.order,
      }));
      usePlayerStore.getState().setEpisode(progress.albumId, progress.albumTitle, {
        ...ep,
        audioUrl: getAudioUrl(ep.audioUrl),
      }, queue);
      router.push("/play");
    } finally {
      setLoading(false);
    }
  }

  if (!progress) return null;

  return (
    <section style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>续听</h2>
      <button
        type="button"
        onClick={handleContinue}
        disabled={loading}
        style={{
          display: "block",
          width: "100%",
          padding: "0.75rem 1rem",
          textAlign: "left",
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
          borderRadius: 8,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        <p style={{ fontWeight: 600, margin: 0 }}>{progress.episodeTitle}</p>
        <p style={{ fontSize: 12, color: "#666", margin: "0.25rem 0 0" }}>
          {progress.albumTitle} · 从 {formatTime(progress.currentTime)} 继续
        </p>
      </button>
    </section>
  );
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(Math.floor(s % 60)).toString().padStart(2, "0")}`;
}
