"use client";

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/stores/player";
import { getAudioUrl } from "@/lib/audio";
import {
  addLocalHistory,
  addLocalFavorite,
  removeLocalFavorite,
  isLocalFavorite,
} from "@/lib/storage";
import type { Album, Episode } from "@/types";

export function AlbumDetail({
  album,
  episodes,
}: {
  album: Album;
  episodes: Episode[];
}) {
  const setEpisode = usePlayerStore((s) => s.setEpisode);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isLocalFavorite(album.id));
  }, [album.id]);

  const handlePlay = (ep: Episode) => {
    addLocalHistory({
      albumId: album.id,
      albumTitle: album.title,
      cover: album.cover,
      episodeId: ep.id,
      episodeTitle: ep.title,
    });
    const queue = episodes.map((e: Episode) => ({
      id: e.id,
      albumId: e.albumId,
      title: e.title,
      duration: e.duration,
      audioUrl: e.audioUrl,
      order: e.order,
    }));
    setEpisode(album.id, album.title, { ...ep, audioUrl: getAudioUrl(ep.audioUrl) }, queue);
  };

  const toggleFavorite = () => {
    if (favorited) {
      removeLocalFavorite(album.id);
      setFavorited(false);
    } else {
      addLocalFavorite({
        albumId: album.id,
        title: album.title,
        author: album.author,
        cover: album.cover || "/placeholder.png",
      });
      setFavorited(true);
    }
  };

  const formatDuration = (sec: number) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  return (
    <>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <img
          src={album.cover || "/placeholder.png"}
          alt=""
          width={96}
          height={96}
          style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ fontSize: "1.125rem", margin: "0 0 0.25rem" }}>{album.title}</h1>
          <p style={{ fontSize: "0.875rem", color: "#666", margin: 0 }}>{album.author}</p>
          <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.5rem 0 0" }}>
            {album.description}
          </p>
          <button
            type="button"
            onClick={toggleFavorite}
            style={{
              marginTop: "0.5rem",
              padding: "0.25rem 0.75rem",
              border: "1px solid #2563eb",
              background: favorited ? "#2563eb" : "transparent",
              color: favorited ? "#fff" : "#2563eb",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            {favorited ? "已收藏" : "收藏"}
          </button>
        </div>
      </div>
      <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>节目列表</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {episodes.map((ep: Episode) => (
          <li
            key={ep.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 0",
              borderBottom: "1px solid #eee",
              gap: "0.5rem",
            }}
          >
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
              {ep.title}
            </span>
            <span style={{ fontSize: "0.875rem", color: "#666", flexShrink: 0 }}>
              {formatDuration(ep.duration)}
            </span>
            <button
              type="button"
              onClick={() => handlePlay(ep)}
              style={{
                padding: "0.25rem 0.75rem",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              播放
            </button>
          </li>
        ))}
      </ul>
      {episodes.length === 0 && <p style={{ color: "#666" }}>暂无节目</p>}
    </>
  );
}
