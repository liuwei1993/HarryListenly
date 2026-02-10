import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.album.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!item) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.album.update({
    where: { id },
    data: {
      title: body.title,
      cover: body.cover,
      description: body.description,
      author: body.author,
      categoryId: body.categoryId,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.album.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
