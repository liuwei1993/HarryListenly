import Link from "next/link";
import { prisma } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [albumCount, episodeCount, categoryCount] = await Promise.all([
    prisma.album.count(),
    prisma.episode.count(),
    prisma.category.count(),
  ]);

  return (
    <main style={{ padding: "2rem", maxWidth: 900 }}>
      <h1 style={{ marginBottom: "1.5rem" }}>工作台</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ padding: "1.5rem", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{albumCount}</p>
          <p style={{ color: "#666", margin: "0.25rem 0 0" }}>专辑</p>
        </div>
        <div style={{ padding: "1.5rem", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{episodeCount}</p>
          <p style={{ color: "#666", margin: "0.25rem 0 0" }}>节目</p>
        </div>
        <div style={{ padding: "1.5rem", background: "#faf5ff", borderRadius: 8, border: "1px solid #e9d5ff" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{categoryCount}</p>
          <p style={{ color: "#666", margin: "0.25rem 0 0" }}>分类</p>
        </div>
      </div>
      <p style={{ marginBottom: "1rem" }}>快捷入口</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "0.5rem" }}>
          <Link href="/categories" style={{ color: "#2563eb" }}>分类管理</Link>
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <Link href="/albums" style={{ color: "#2563eb" }}>专辑管理</Link>
        </li>
      </ul>
      <Link href="/" style={{ display: "inline-block", marginTop: "1.5rem", color: "#2563eb" }}>返回首页</Link>
    </main>
  );
}
