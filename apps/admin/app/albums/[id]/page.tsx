import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/db";
import { EditAlbumForm } from "../../../components/albums/EditAlbumForm";

export const dynamic = "force-dynamic";

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id }, include: { category: true } });
  if (!album) notFound();
  const categories = await prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" } });

  return (
    <main style={{ padding: "1.5rem", maxWidth: 500 }}>
      <Link href="/albums" style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>返回专辑</Link>
      <h1>编辑专辑</h1>
      <EditAlbumForm
        id={id}
        title={album.title}
        author={album.author}
        description={album.description}
        cover={album.cover}
        categoryId={album.categoryId}
        categories={categories}
      />
    </main>
  );
}
