"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EditEpisodeForm({
  albumId,
  episodeId,
  title,
  duration,
  audioUrl,
  order,
}: {
  albumId: string;
  episodeId: string;
  title: string;
  duration: number;
  audioUrl: string;
  order: number;
}) {
  const [form, setForm] = useState({ title, duration, audioUrl, order });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/albums/${albumId}/episodes/${episodeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push(`/albums/${albumId}/episodes`);
      router.refresh();
    } else alert("保存失败");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>编辑节目</CardTitle>
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
            <Label htmlFor="duration">时长（秒）</Label>
            <Input
              id="duration"
              type="number"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audioUrl">音频 URL</Label>
            <Input
              id="audioUrl"
              value={form.audioUrl}
              onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">排序</Label>
            <Input
              id="order"
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">保存</Button>
            <Button type="button" variant="outline" asChild>
              <Link href={`/albums/${albumId}/episodes`}>取消</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
