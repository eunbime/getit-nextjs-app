export { default } from "next-auth/middleware";

// 로그인 된 사람만 접근 가능
export const config = { matcher: ["/admin/:path*", "/user/:path*"] };
