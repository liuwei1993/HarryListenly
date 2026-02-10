"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditEpisodeForm({
  albumId,
  episodeId,
  title,
  duration,
  audioUrl,
  order,
}: {
  albumId: string;
  episodeId: string;
  title: string;
  duration: number;
  audioUrl: string;
  order: number;
}) {
  const [form, setForm] = useState({ title, duration, audioUrl, order });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/albums/${albumId}/episodes/${episodeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push(`/albums/${albumId}/episodes`);
      router.refresh();
    } else alert("保存失败");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>标题</label>
      <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <label style={{ display: "block", marginBottom: "0.5rem" }}>时长（秒）</label>
      <input type="number" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))} min={0} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <label style={{ display: "block", marginBottom: "0.5rem" }}>音频 URL</label>
      <input value={form.audioUrl} onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <label style={{ display: "block", marginBottom: "0.5rem" }}>排序</label>
      <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <button type="submit" style={{ padding: "0.5rem 1rem", marginRight: 8 }}>保存</button>
      <a href={`/albums/${albumId}/episodes`} style={{ color: "#2563eb" }}>取消</a>
    </form>
  );
}
