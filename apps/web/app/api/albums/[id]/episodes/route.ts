import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
