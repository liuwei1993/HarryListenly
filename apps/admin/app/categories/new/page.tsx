"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      router.push("/categories");
      router.refresh();
    } else alert("创建失败");
  }

  return (
    <main style={{ padding: "1.5rem", maxWidth: 500 }}>
      <h1>新增分类</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>名称</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginRight: 8 }}>保存</button>
        <Link href="/categories" style={{ color: "#2563eb" }}>取消</Link>
      </form>
    </main>
  );
}
