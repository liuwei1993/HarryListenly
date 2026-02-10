import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.category.findUnique({ where: { id } });
  if (!item) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      cover: body.cover ?? undefined,
      parentId: body.parentId ?? undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const count = await prisma.album.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: "该分类下有关联专辑，无法删除" },
      { status: 400 }
    );
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
