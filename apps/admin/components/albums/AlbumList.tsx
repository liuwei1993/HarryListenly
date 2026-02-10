"use client";

import Link from "next/link";

type Album = {
  id: string;
  title: string;
  author: string;
  episodeCount: number;
  category: { name: string } | null;
};

export function AlbumList({ albums }: { albums: Album[] }) {
  async function handleDelete(id: string) {
    if (!confirm("确定删除该专辑？其下节目将一并删除。")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/albums/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
    else alert("删除失败");
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #eee" }}>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>标题</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>作者</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>分类</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>节目数</th>
          <th style={{ textAlign: "right", padding: "0.5rem" }}>操作</th>
        </tr>
      </thead>
      <tbody>
        {albums.map((a: Album) => (
          <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>{a.title}</td>
            <td style={{ padding: "0.5rem" }}>{a.author}</td>
            <td style={{ padding: "0.5rem" }}>{a.category?.name ?? "-"}</td>
            <td style={{ padding: "0.5rem" }}>{a.episodeCount}</td>
            <td style={{ padding: "0.5rem", textAlign: "right" }}>
              <Link href={`/albums/${a.id}/episodes`} style={{ marginRight: 8, color: "#2563eb" }}>节目</Link>
              <Link href={`/albums/${a.id}`} style={{ marginRight: 8, color: "#2563eb" }}>编辑</Link>
              <button type="button" onClick={() => handleDelete(a.id)} style={{ color: "#dc2626", cursor: "pointer", background: "none", border: "none" }}>
                删除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
