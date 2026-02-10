import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { AlbumDetail } from "@/components/album/AlbumDetail";

export const dynamic = "force-dynamic";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!album) notFound();

  const episodes = await prisma.episode.findMany({
    where: { albumId: id },
    orderBy: { order: "asc" },
  });

  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <Link href="/" style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>
        返回首页
      </Link>
      <AlbumDetail
        album={{
          id: album.id,
          title: album.title,
          cover: album.cover,
          description: album.description,
          author: album.author,
          categoryId: album.categoryId,
          playCount: album.playCount,
          subscribeCount: album.subscribeCount,
          episodeCount: album.episodeCount,
          updatedAt: album.updatedAt.toISOString(),
        }}
        episodes={episodes.map((e: { id: string; albumId: string; title: string; duration: number; audioUrl: string; order: number; createdAt: Date }) => ({
          id: e.id,
          albumId: e.albumId,
          title: e.title,
          duration: e.duration,
          audioUrl: e.audioUrl,
          order: e.order,
          createdAt: e.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
