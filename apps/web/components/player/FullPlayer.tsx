"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePlayerStore } from "@/stores/player";
import { useAudio } from "@/lib/useAudio";
import { setLocalProgress } from "@/lib/storage";

const SAVE_INTERVAL_MS = 5000;

export function FullPlayer() {
  const {
    albumId,
    currentEpisode,
    albumTitle,
    queue,
    status,
    currentTime,
    duration,
    playbackRate,
    setEpisode,
    setStatus,
    seek,
    setRate,
  } = usePlayerStore();

  useAudio({
    currentEpisode,
    status,
    playbackRate,
    currentTime,
    seek,
    setCurrentTime: usePlayerStore.getState().setCurrentTime,
    setDuration: usePlayerStore.getState().setDuration,
    setStatus,
    onEnded: () => {
      const s = usePlayerStore.getState();
      const idx = s.queue.findIndex((e) => e.id === s.currentEpisode?.id);
      if (idx >= 0 && idx < s.queue.length - 1) {
        const next = s.queue[idx + 1];
        setEpisode(s.albumId!, s.albumTitle!, next, s.queue);
      } else {
        setStatus("idle");
      }
    },
  });

  useEffect(() => {
    if (!currentEpisode || !albumId || !albumTitle) return;
    const save = () => {
      const s = usePlayerStore.getState();
      setLocalProgress({
        albumId: s.albumId!,
        albumTitle: s.albumTitle!,
        episodeId: s.currentEpisode!.id,
        episodeTitle: s.currentEpisode!.title,
        currentTime: s.currentTime,
        duration: s.duration,
        updatedAt: new Date().toISOString(),
      });
    };
    if (status === "paused") save();
    if (status === "playing") {
      save();
      const id = setInterval(save, SAVE_INTERVAL_MS);
      return () => clearInterval(id);
    }
  }, [status, currentEpisode?.id, albumId, albumTitle]);

  if (!currentEpisode) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
        <p style={{ color: "#666" }}>暂无播放</p>
        <Link href="/" style={{ color: "#2563eb" }}>去首页</Link>
      </div>
    );
  }

  const currentIndex = queue.findIndex((e) => e.id === currentEpisode.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < queue.length - 1;
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(Math.floor(s % 60)).toString().padStart(2, "0")}`;
  const rates = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: 100 }}>
      <header style={{ height: 56, display: "flex", alignItems: "center", padding: "0 1rem", borderBottom: "1px solid #eee" }}>
        <Link href="/" style={{ color: "#2563eb" }}>返回</Link>
      </header>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ width: 192, height: 192, background: "#e5e7eb", borderRadius: 16, marginBottom: "2rem" }} />
        <p style={{ fontWeight: 600, textAlign: "center" }}>{currentEpisode.title}</p>
        <p style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{albumTitle}</p>
        <div style={{ width: "100%", marginTop: "2rem" }}>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginTop: 4 }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: "2rem" }}>
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => hasPrev && setEpisode(currentEpisode.albumId, albumTitle!, queue[currentIndex - 1], queue)}
            style={{ padding: 8, opacity: hasPrev ? 1 : 0.5 }}
          >
            上一集
          </button>
          <button
            type="button"
            onClick={() => setStatus(usePlayerStore.getState().status === "playing" ? "paused" : "playing")}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {status === "playing" ? "暂停" : "播放"}
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => hasNext && setEpisode(currentEpisode.albumId, albumTitle!, queue[currentIndex + 1], queue)}
            style={{ padding: 8, opacity: hasNext ? 1 : 0.5 }}
          >
            下一集
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: "1.5rem" }}>
          {rates.map((r: number) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "none",
                background: playbackRate === r ? "#2563eb" : "#e5e7eb",
                color: playbackRate === r ? "#fff" : "#374151",
                cursor: "pointer",
              }}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
