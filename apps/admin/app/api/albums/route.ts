import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const list = await prisma.album.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, cover, description, author, categoryId } = body;
  const created = await prisma.album.create({
    data: {
      title: title ?? "",
      cover: cover ?? "/placeholder.png",
      description: description ?? "",
      author: author ?? "",
      categoryId: categoryId ?? "",
    },
  });
  return NextResponse.json(created);
}
