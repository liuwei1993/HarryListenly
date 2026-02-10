"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditCategoryForm({ id, name }: { id: string; name: string }) {
  const [value, setValue] = useState(name);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    });
    if (res.ok) {
      router.push("/categories");
      router.refresh();
    } else alert("保存失败");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>名称</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
      <button type="submit" style={{ padding: "0.5rem 1rem", marginRight: 8 }}>保存</button>
      <a href="/categories" style={{ color: "#2563eb" }}>取消</a>
    </form>
  );
}
