import Link from "next/link";
import { prisma } from "@/lib/db";
import { ContinueListening } from "@/components/home/ContinueListening";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const albums = await prisma.album.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-lg px-4 py-4">
      <ContinueListening />
      <h1 className="mb-4 text-xl font-semibold tracking-tight">精选</h1>
      <ul className="space-y-3">
        {albums.map((a: (typeof albums)[number]) => (
          <li key={a.id}>
            <Link href={`/album/${a.id}`} className="block">
              <Card className="overflow-hidden transition-colors hover:bg-muted/50">
                <CardContent className="flex gap-4 p-0">
                  <img
                    src={a.cover || "/placeholder.png"}
                    alt=""
                    width={96}
                    height={96}
                    className="h-24 w-24 shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1 py-4 pr-4">
                    <p className="font-semibold leading-tight">{a.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.author} · {a.category?.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      {albums.length === 0 && (
        <p className="text-muted-foreground">暂无专辑，请先在管理后台添加或执行种子数据。</p>
      )}
    </main>
  );
}
