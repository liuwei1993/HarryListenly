import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { EpisodeList } from "../../../../components/episodes/EpisodeList";

export const dynamic = "force-dynamic";

export default async function EpisodesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) notFound();

  const episodes = await prisma.episode.findMany({
    where: { albumId: id },
    orderBy: { order: "asc" },
  });

  return (
    <main style={{ padding: "1.5rem", maxWidth: 900 }}>
      <Link href="/albums" style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>返回专辑列表</Link>
      <h1 style={{ marginBottom: "0.5rem" }}>{album.title} · 节目列表</h1>
      <p style={{ color: "#666", marginBottom: "1rem" }}>共 {episodes.length} 集</p>
      <Link href={`/albums/${id}/episodes/new`} style={{ display: "inline-block", padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", textDecoration: "none", borderRadius: 6, marginBottom: "1rem" }}>
        新增节目
      </Link>
      <EpisodeList albumId={id} episodes={episodes} />
    </main>
  );
}
