import Link from "next/link";
import { prisma } from "../../lib/db";
import { AlbumList } from "../../components/albums/AlbumList";

export const dynamic = "force-dynamic";

export default async function AlbumsPage() {
  const albums = await prisma.album.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main style={{ padding: "1.5rem", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>专辑管理</h1>
        <Link href="/albums/new" style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", textDecoration: "none", borderRadius: 6 }}>
          新增专辑
        </Link>
      </div>
      <AlbumList albums={albums} />
    </main>
  );
}
