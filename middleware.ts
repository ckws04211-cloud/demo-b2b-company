import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE, verifySession } from "./lib/session";

const intl = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 관리자 영역: 로그인 화면을 제외하고 2단계 인증까지 마친 세션만 허용
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/otp") return NextResponse.next();
    const s = await verifySession(req.cookies.get(SESSION_COOKIE)?.value, "full");
    if (!s) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  return intl(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
