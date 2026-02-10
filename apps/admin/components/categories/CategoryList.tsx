"use client";

import Link from "next/link";

type Cat = {
  id: string;
  name: string;
  _count: { albums: number };
};

export function CategoryList({ categories }: { categories: Cat[] }) {
  async function handleDelete(id: string) {
    if (!confirm("确定删除该分类？")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
    else alert((await res.json()).error || "删除失败");
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #eee" }}>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>名称</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>专辑数</th>
          <th style={{ textAlign: "right", padding: "0.5rem" }}>操作</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((c: Cat) => (
          <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "0.5rem" }}>{c.name}</td>
            <td style={{ padding: "0.5rem" }}>{c._count.albums}</td>
            <td style={{ padding: "0.5rem", textAlign: "right" }}>
              <Link href={`/categories/${c.id}`} style={{ marginRight: 8, color: "#2563eb" }}>编辑</Link>
              <button type="button" onClick={() => handleDelete(c.id)} style={{ color: "#dc2626", cursor: "pointer", background: "none", border: "none" }}>
                删除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
