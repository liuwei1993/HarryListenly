"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLocalFavorites, removeLocalFavorite } from "@/lib/storage";
import type { FavoriteItem } from "@/lib/storage";

export function FavoritesList() {
  const [list, setList] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setList(getLocalFavorites());
  }, []);

  function handleRemove(albumId: string) {
    removeLocalFavorite(albumId);
    setList(getLocalFavorites());
  }

  if (list.length === 0) {
    return <p style={{ color: "#666" }}>暂无收藏，在专辑页点击「收藏」添加</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {list.map((item) => (
        <li
          key={item.albumId}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <Link
            href={`/album/${item.albumId}`}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0, textDecoration: "none", color: "inherit" }}
          >
            <img
              src={item.cover || "/placeholder.png"}
              alt=""
              width={56}
              height={56}
              style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
            />
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{item.title}</p>
              <p style={{ fontSize: 12, color: "#666", margin: "0.25rem 0 0" }}>{item.author}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => handleRemove(item.albumId)}
            style={{
              padding: "0.25rem 0.75rem",
              border: "1px solid #dc2626",
              background: "transparent",
              color: "#dc2626",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            取消收藏
          </button>
        </li>
      ))}
    </ul>
  );
}
