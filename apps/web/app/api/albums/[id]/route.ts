import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!album) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(album);
}
