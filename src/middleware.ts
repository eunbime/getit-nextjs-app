import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.JWT_SECRET });
  const pathname = req.nextUrl.pathname;

  // 로그인 된 유저만 접근 가능
  if (pathname.startsWith("/chat") && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (pathname.startsWith("/user") && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (pathname.startsWith("/products/upload") && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 관리자 유저만 접근 가능
  if (pathname.startsWith("/admin") && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 로그인 된 유저는 로그인, 회원가입 페이지에 접근 불가
  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.next();

  // bfcache를 위한 Cache-Control 헤더 설정
  if (!req.nextUrl.pathname.startsWith("/_next")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, must-revalidate"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
