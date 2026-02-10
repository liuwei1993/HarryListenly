import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    if (password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("admin_session", "1", {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return res;
    }
    return NextResponse.json({ ok: false, message: "密码错误" }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
