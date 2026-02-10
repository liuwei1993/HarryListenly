"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export function EditAlbumForm({
  id,
  title,
  author,
  description,
  cover,
  categoryId,
  categories,
}: {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  categoryId: string;
  categories: Category[];
}) {
  const [form, setForm] = useState({ title, author, description, cover, categoryId });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/albums");
      router.refresh();
    } else alert("保存失败");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>标题</label>
      <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <label style={{ display: "block", marginBottom: "0.5rem" }}>作者</label>
      <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <label style={{ display: "block", marginBottom: "0.5rem" }}>分类</label>
      <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}>
        {categories.map((c: Category) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>简介</label>
      <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <label style={{ display: "block", marginBottom: "0.5rem" }}>封面 URL</label>
      <input value={form.cover} onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <button type="submit" style={{ padding: "0.5rem 1rem", marginRight: 8 }}>保存</button>
      <a href="/albums" style={{ color: "#2563eb" }}>取消</a>
    </form>
  );
}
