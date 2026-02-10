import Link from "next/link";
import { HistoryList } from "@/components/me/HistoryList";

export default function HistoryPage() {
  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <Link href="/me" style={{ color: "#2563eb", marginBottom: "1rem", display: "inline-block" }}>返回我的</Link>
      <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>收听历史</h1>
      <HistoryList />
    </main>
  );
}
