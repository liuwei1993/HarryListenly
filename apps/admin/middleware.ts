import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_PATH = "/login";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  const isLoginPage = req.nextUrl.pathname === LOGIN_PATH;
  if (isLoginPage) {
    if (session) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }
  if (!session) return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/", "/login", "/dashboard", "/categories/:path*", "/albums/:path*"] };
