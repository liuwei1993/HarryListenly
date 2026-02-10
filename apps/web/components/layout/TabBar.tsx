"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页" },
  { href: "/search", label: "搜索" },
  { href: "/category", label: "分类" },
  { href: "/me", label: "我的" },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: "#fff",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 40,
      }}
    >
      {tabs.map((t: (typeof tabs)[number]) => (
        <Link
          key={t.href}
          href={t.href}
          style={{
            color: pathname === t.href ? "#2563eb" : "#666",
            fontWeight: pathname === t.href ? 600 : 400,
            textDecoration: "none",
          }}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
