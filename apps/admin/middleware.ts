import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE_PATH = "/listenly-admin";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === "/login";
  if (isLoginPage) {
    if (session) return NextResponse.redirect(new URL(BASE_PATH + "/", req.url));
    return NextResponse.next();
  }
  if (!session) return NextResponse.redirect(new URL(BASE_PATH + "/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/", "/login", "/dashboard", "/categories/:path*", "/albums/:path*"] };
