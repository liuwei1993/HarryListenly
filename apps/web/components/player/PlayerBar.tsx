"use client";

import Link from "next/link";
import { usePlayerStore } from "@/stores/player";

export function PlayerBar() {
  const { currentEpisode, albumTitle } = usePlayerStore();
  if (!currentEpisode) return null;

  return (
    <Link
      href="/play"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 56,
        height: 56,
        background: "#fff",
        borderTop: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 1rem",
        textDecoration: "none",
        color: "inherit",
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: "#e5e7eb",
          borderRadius: 8,
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {currentEpisode.title}
        </p>
        <p style={{ fontSize: 12, color: "#666", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {albumTitle ?? "听书"}
        </p>
      </div>
    </Link>
  );
}
