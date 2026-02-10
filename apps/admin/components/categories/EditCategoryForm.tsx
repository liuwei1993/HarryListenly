"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EditCategoryForm({ id, name }: { id: string; name: string }) {
  const [value, setValue] = useState(name);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    });
    if (res.ok) {
      router.push("/categories");
      router.refresh();
    } else alert("保存失败");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>编辑分类</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">保存</Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/categories">取消</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
