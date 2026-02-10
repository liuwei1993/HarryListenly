import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>分类</h1>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {categories.map((c: (typeof categories)[number]) => (
          <li key={c.id}>
            <Link
              href={`/category/${c.id}`}
              style={{
                display: "block",
                padding: "1rem",
                background: "#f5f5f5",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
      {categories.length === 0 && <p style={{ color: "#666" }}>暂无分类</p>}
    </main>
  );
}
