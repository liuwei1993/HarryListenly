import Link from "next/link";

export default function MePage() {
  return (
    <main style={{ padding: "1rem", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>我的</h1>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ borderBottom: "1px solid #eee" }}>
          <Link href="/me/history" style={{ display: "block", padding: "1rem", color: "inherit", textDecoration: "none" }}>
            收听历史
          </Link>
        </li>
        <li style={{ borderBottom: "1px solid #eee" }}>
          <Link href="/me/favorites" style={{ display: "block", padding: "1rem", color: "inherit", textDecoration: "none" }}>
            我的收藏
          </Link>
        </li>
      </ul>
    </main>
  );
}
