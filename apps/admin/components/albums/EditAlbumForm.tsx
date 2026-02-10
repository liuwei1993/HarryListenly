"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Category = { id: string; name: string };

export function EditAlbumForm({
  id,
  title,
  author,
  description,
  cover,
  categoryId,
  categories,
}: {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  categoryId: string;
  categories: Category[];
}) {
  const [form, setForm] = useState({ title, author, description, cover, categoryId });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/albums");
      router.refresh();
    } else alert("保存失败");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>编辑专辑</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">作者</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">分类</Label>
            <Select
              id="category"
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            >
              {categories.map((c: Category) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">简介</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">封面 URL</Label>
            <Input
              id="cover"
              value={form.cover}
              onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">保存</Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/albums">取消</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
