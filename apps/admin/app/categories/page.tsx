import Link from "next/link";
import { prisma } from "../../lib/db";
import { CategoryList } from "../../components/categories/CategoryList";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true, _count: { select: { albums: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">分类管理</h1>
        <Button asChild>
          <Link href="/categories/new">新增分类</Link>
        </Button>
      </div>
      <CategoryList categories={categories} />
    </main>
  );
}
