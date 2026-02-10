import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../../../lib/db";
import { EditEpisodeForm } from "../../../../../components/episodes/EditEpisodeForm";

export const dynamic = "force-dynamic";

export default async function EditEpisodePage({
  params,
}: {
  params: Promise<{ id: string; eid: string }>;
}) {
  const { id: albumId, eid } = await params;
  const episode = await prisma.episode.findUnique({ where: { id: eid } });
  if (!episode) notFound();

  return (
    <main style={{ padding: "1.5rem", maxWidth: 500 }}>
      <Link href={`/albums/${albumId}/episodes`} style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>返回节目列表</Link>
      <h1>编辑节目</h1>
      <EditEpisodeForm albumId={albumId} episodeId={eid} title={episode.title} duration={episode.duration} audioUrl={episode.audioUrl} order={episode.order} />
    </main>
  );
}
