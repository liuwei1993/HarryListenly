import Link from "next/link";
import { prisma } from "@/lib/db";
import { ContinueListening } from "@/components/home/ContinueListening";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const albums = await prisma.album.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto" }}>
      <ContinueListening />
      <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>精选</h1>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {albums.map((a: (typeof albums)[number]) => (
          <li key={a.id} style={{ marginBottom: "1rem" }}>
            <Link
              href={`/album/${a.id}`}
              style={{
                display: "flex",
                gap: "0.75rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={a.cover || "/placeholder.png"}
                alt=""
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{a.title}</p>
                <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.25rem 0 0" }}>
                  {a.author} · {a.category?.name}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {albums.length === 0 && (
        <p style={{ color: "#666" }}>暂无专辑，请先在管理后台添加或执行种子数据。</p>
      )}
    </main>
  );
}
