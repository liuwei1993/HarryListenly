import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; eid: string }> }
) {
  const { eid } = await params;
  const item = await prisma.episode.findUnique({ where: { id: eid } });
  if (!item) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; eid: string }> }
) {
  const { eid } = await params;
  const body = await req.json();
  const updated = await prisma.episode.update({
    where: { id: eid },
    data: {
      title: body.title,
      duration: body.duration,
      audioUrl: body.audioUrl,
      order: body.order,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; eid: string }> }
) {
  const { id: albumId, eid } = await params;
  await prisma.episode.delete({ where: { id: eid } });
  await prisma.album.update({
    where: { id: albumId },
    data: { episodeCount: { decrement: 1 } },
  });
  return NextResponse.json({ ok: true });
}
