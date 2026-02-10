"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button type="button" onClick={handleLogout} style={{ padding: "0.25rem 0.75rem", color: "#666", cursor: "pointer" }}>
      退出
    </button>
  );
}
