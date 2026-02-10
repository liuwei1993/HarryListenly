"use client";

import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Album = {
  id: string;
  title: string;
  cover: string;
  author: string;
  category: { name: string } | null;
  episodeCount: number;
};

type Episode = {
  id: string;
  albumId: string;
  title: string;
  duration: number;
  order: number;
  album: { id: string; title: string; author: string; cover: string };
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async () => {
    const term = q.trim();
    if (!term) {
      setAlbums([]);
      setEpisodes([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setAlbums(data.albums || []);
      setEpisodes(data.episodes || []);
    } finally {
      setLoading(false);
    }
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索专辑、节目"
          style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          搜索
        </button>
      </form>

      {loading && <p style={{ color: "#666" }}>搜索中…</p>}
      {!loading && searched && (
        <>
          {albums.length > 0 && (
            <section style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>专辑</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {albums.map((a: Album) => (
                  <li key={a.id} style={{ marginBottom: "0.75rem" }}>
                    <Link href={`/album/${a.id}`} style={{ display: "flex", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
                      <img src={a.cover || "/placeholder.png"} alt="" width={56} height={56} style={{ borderRadius: 6, objectFit: "cover" }} />
                      <div>
                        <p style={{ fontWeight: 600, margin: 0 }}>{a.title}</p>
                        <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{a.author} · {a.episodeCount} 集</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {episodes.length > 0 && (
            <section>
              <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>节目</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {episodes.map((e: Episode) => (
                  <li key={e.id} style={{ marginBottom: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
                    <Link href={`/album/${e.albumId}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <p style={{ fontWeight: 500, margin: 0 }}>{e.title}</p>
                      <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{e.album.title} · {e.album.author} · {formatDuration(e.duration)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {albums.length === 0 && episodes.length === 0 && (
            <p style={{ color: "#666" }}>未找到相关专辑或节目</p>
          )}
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}><p style={{ color: "#666" }}>加载中…</p></main>}>
      <SearchContent />
    </Suspense>
  );
}
