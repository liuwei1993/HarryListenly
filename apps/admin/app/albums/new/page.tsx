"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export default function NewAlbumPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("/placeholder.png");
  const [categoryId, setCategoryId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .then(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      alert("请选择分类");
      return;
    }
    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, description, cover, categoryId }),
    });
    if (res.ok) {
      const album = await res.json();
      router.push(`/albums/${album.id}/episodes`);
      router.refresh();
    } else alert("创建失败");
  }

  return (
    <main style={{ padding: "1.5rem", maxWidth: 500 }}>
      <h1>新增专辑</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>标题</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <label style={{ display: "block", marginBottom: "0.5rem" }}>作者</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <label style={{ display: "block", marginBottom: "0.5rem" }}>分类</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}>
          <option value="">请选择</option>
          {categories.map((c: Category) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>简介</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <label style={{ display: "block", marginBottom: "0.5rem" }}>封面 URL</label>
        <input value={cover} onChange={(e) => setCover(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginRight: 8 }}>保存</button>
        <a href="/albums" style={{ color: "#2563eb" }}>取消</a>
      </form>
    </main>
  );
}
