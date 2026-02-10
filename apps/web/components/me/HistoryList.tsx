"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLocalHistory } from "@/lib/storage";
import { usePlayerStore } from "@/stores/player";
import { getAudioUrl } from "@/lib/audio";
import type { HistoryItem } from "@/lib/storage";

export function HistoryList() {
  const [list, setList] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setList(getLocalHistory());
  }, []);

  async function playItem(item: HistoryItem) {
    const [albumRes, episodesRes] = await Promise.all([
      fetch(`/api/albums/${item.albumId}`),
      fetch(`/api/albums/${item.albumId}/episodes`),
    ]);
    if (!albumRes.ok || !episodesRes.ok) return;
    const episodes = await episodesRes.json();
    const ep = episodes.find((e: { id: string }) => e.id === item.episodeId);
    if (!ep) return;
    const queue = episodes.map((e: { id: string; albumId: string; title: string; duration: number; audioUrl: string; order: number }) => ({
      id: e.id,
      albumId: e.albumId,
      title: e.title,
      duration: e.duration,
      audioUrl: getAudioUrl(e.audioUrl),
      order: e.order,
    }));
    usePlayerStore.getState().setEpisode(item.albumId, item.albumTitle, { ...ep, audioUrl: getAudioUrl(ep.audioUrl) }, queue);
    router.push("/play");
  }

  if (list.length === 0) {
    return <p style={{ color: "#666" }}>暂无收听历史，去首页听听吧</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {list.map((item) => (
        <li
          key={`${item.albumId}-${item.episodeId}-${item.playedAt}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <img
            src={item.cover || "/placeholder.png"}
            alt=""
            width={48}
            height={48}
            style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 500, margin: 0 }}>{item.episodeTitle}</p>
            <p style={{ fontSize: 12, color: "#666", margin: "0.25rem 0 0" }}>{item.albumTitle}</p>
          </div>
          <button
            type="button"
            onClick={() => playItem(item)}
            style={{
              padding: "0.25rem 0.75rem",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            续听
          </button>
          <Link
            href={`/album/${item.albumId}`}
            style={{ fontSize: 12, color: "#2563eb" }}
          >
            专辑
          </Link>
        </li>
      ))}
    </ul>
  );
}
