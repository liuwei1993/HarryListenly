import Link from "next/link";
import { prisma } from "../../lib/db";
import { CategoryList } from "../../components/categories/CategoryList";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true, _count: { select: { albums: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <main style={{ padding: "1.5rem", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>分类管理</h1>
        <Link href="/categories/new" style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", textDecoration: "none", borderRadius: 6 }}>
          新增分类
        </Link>
      </div>
      <CategoryList categories={categories} />
    </main>
  );
}
