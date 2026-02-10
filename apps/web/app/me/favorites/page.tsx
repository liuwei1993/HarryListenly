import Link from "next/link";
import { FavoritesList } from "@/components/me/FavoritesList";

export default function FavoritesPage() {
  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <Link href="/me" style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>返回我的</Link>
      <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>我的收藏</h1>
      <FavoritesList />
    </main>
  );
}
