import type { Metadata } from "next";
import "./globals.css";
import { PlayerBar } from "@/components/player/PlayerBar";
import { TabBar } from "@/components/layout/TabBar";

export const metadata: Metadata = {
  title: "HarryListenly 听书",
  description: "手机 Web 听书",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="min-h-screen pb-14">
        {children}
        <PlayerBar />
        <TabBar />
      </body>
    </html>
  );
}
