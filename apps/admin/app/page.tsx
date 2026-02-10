import Link from "next/link";
import { LogoutButton } from "../components/LogoutButton";

export default function AdminHomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: 600 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>HarryListenly 管理后台</h1>
        <LogoutButton />
      </div>
      <p>请选择入口：</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "0.5rem" }}>
          <Link href="/dashboard" style={{ color: "#2563eb" }}>工作台</Link>
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <Link href="/categories" style={{ color: "#2563eb" }}>分类管理</Link>
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <Link href="/albums" style={{ color: "#2563eb" }}>专辑管理</Link>
        </li>
      </ul>
    </main>
  );
}
