import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CategoryAlbumsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const albums = await prisma.album.findMany({
    where: { categoryId: id },
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <Link href="/category" style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>
        返回分类
      </Link>
      <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{category.name}</h1>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {albums.map((a: (typeof albums)[number]) => (
          <li key={a.id} style={{ marginBottom: "1rem" }}>
            <Link
              href={`/album/${a.id}`}
              style={{ display: "flex", gap: "0.75rem", textDecoration: "none", color: "inherit" }}
            >
              <img
                src={a.cover || "/placeholder.png"}
                alt=""
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
              />
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>{a.title}</p>
                <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.25rem 0 0" }}>{a.author}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {albums.length === 0 && <p style={{ color: "#666" }}>该分类下暂无专辑</p>}
    </main>
  );
}
