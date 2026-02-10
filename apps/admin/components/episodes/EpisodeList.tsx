"use client";

import Link from "next/link";

type Episode = {
  id: string;
  title: string;
  duration: number;
  audioUrl: string;
  order: number;
};

export function EpisodeList({ albumId, episodes }: { albumId: string; episodes: Episode[] }) {
  async function handleDelete(eid: string) {
    if (!confirm("确定删除该节目？")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/albums/${albumId}/episodes/${eid}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
    else alert("删除失败");
  }

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #eee" }}>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>序号</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>标题</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>时长</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>音频</th>
          <th style={{ textAlign: "right", padding: "0.5rem" }}>操作</th>
        </tr>
      </thead>
      <tbody>
        {episodes.map((e: Episode) => (
          <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>{e.order}</td>
            <td style={{ padding: "0.5rem" }}>{e.title}</td>
            <td style={{ padding: "0.5rem" }}>{formatDuration(e.duration)}</td>
            <td style={{ padding: "0.5rem", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{e.audioUrl}</td>
            <td style={{ padding: "0.5rem", textAlign: "right" }}>
              <Link href={`/albums/${albumId}/episodes/${e.id}`} style={{ marginRight: 8, color: "#2563eb" }}>编辑</Link>
              <button type="button" onClick={() => handleDelete(e.id)} style={{ color: "#dc2626", cursor: "pointer", background: "none", border: "none" }}>删除</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
