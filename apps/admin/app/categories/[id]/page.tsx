import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/db";
import { EditCategoryForm } from "../../../components/categories/EditCategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <main style={{ padding: "1.5rem", maxWidth: 500 }}>
      <Link href="/categories" style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>返回分类</Link>
      <h1>编辑分类</h1>
      <EditCategoryForm id={id} name={category.name} />
    </main>
  );
}
