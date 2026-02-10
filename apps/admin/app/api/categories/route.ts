import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
  const list = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, cover, parentId } = body;
  const created = await prisma.category.create({
    data: {
      name: name ?? "",
      cover: cover ?? null,
      parentId: parentId ?? null,
    },
  });
  return NextResponse.json(created);
}
