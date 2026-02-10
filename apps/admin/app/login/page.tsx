"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(data.message || "登录失败");
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 400, margin: "4rem auto" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>管理后台登录</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          密码
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          登录
        </button>
      </form>
    </main>
  );
}
