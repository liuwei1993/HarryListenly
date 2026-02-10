import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const list = await prisma.episode.findMany({
    where: { albumId: id },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(list);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: albumId } = await params;
  const body = await req.json();
  const { title, duration, audioUrl, order } = body;
  const maxOrder = await prisma.episode
    .aggregate({ where: { albumId }, _max: { order: true } })
    .then((r) => r._max.order ?? -1);
  const created = await prisma.episode.create({
    data: {
      albumId,
      title: title ?? "",
      duration: Number(duration) ?? 0,
      audioUrl: audioUrl ?? "",
      order: Number(order) ?? maxOrder + 1,
    },
  });
  await prisma.album.update({
    where: { id: albumId },
    data: { episodeCount: { increment: 1 } },
  });
  return NextResponse.json(created);
}
