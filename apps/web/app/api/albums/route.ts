import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const list = await prisma.album.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(list);
}
