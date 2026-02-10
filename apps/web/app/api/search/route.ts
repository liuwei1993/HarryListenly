import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q) {
    return NextResponse.json({ albums: [], episodes: [] });
  }

  const keyword = `%${q}%`;

  const [albums, episodes] = await Promise.all([
    prisma.album.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { author: { contains: q } },
          { description: { contains: q } },
        ],
      },
      include: { category: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.episode.findMany({
      where: { title: { contains: q } },
      include: { album: { select: { id: true, title: true, author: true, cover: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return NextResponse.json({
    albums: albums.map((a: (typeof albums)[number]) => ({
      id: a.id,
      title: a.title,
      cover: a.cover,
      author: a.author,
      description: a.description,
      category: a.category,
      episodeCount: a.episodeCount,
    })),
    episodes: episodes.map((e: (typeof episodes)[number]) => ({
      id: e.id,
      albumId: e.albumId,
      title: e.title,
      duration: e.duration,
      order: e.order,
      album: e.album,
    })),
  });
}
