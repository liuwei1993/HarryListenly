"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NewEpisodePage() {
  const params = useParams();
  const albumId = params.id as string;
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/albums/${albumId}/episodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, duration: Number(duration), audioUrl }),
    });
    if (res.ok) {
      router.push(`/albums/${albumId}/episodes`);
      router.refresh();
    } else alert("创建失败");
  }

  return (
    <main style={{ padding: "1.5rem", maxWidth: 500 }}>
      <h1>新增节目</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>标题</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <label style={{ display: "block", marginBottom: "0.5rem" }}>时长（秒）</label>
        <input type="number" value={duration || ""} onChange={(e) => setDuration(Number(e.target.value))} min={0} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <label style={{ display: "block", marginBottom: "0.5rem" }}>音频 URL（相对路径如 /audio/xxx.mp3）</label>
        <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="/audio/album1/ep1.mp3" style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginRight: 8 }}>保存</button>
        <a href={`/albums/${albumId}/episodes`} style={{ color: "#2563eb" }}>取消</a>
      </form>
    </main>
  );
}
