import Link from "next/link";
import { prisma } from "../../lib/db";
import { AlbumList } from "../../components/albums/AlbumList";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AlbumsPage() {
  const albums = await prisma.album.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">专辑管理</h1>
        <Button asChild>
          <Link href="/albums/new">新增专辑</Link>
        </Button>
      </div>
      <AlbumList albums={albums} />
    </main>
  );
}
