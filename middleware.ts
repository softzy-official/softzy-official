import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const token = (req as any).nextauth?.token;
    const path = req.nextUrl.pathname;

    const isAdminPath = path === "/admin" || path.startsWith("/admin/");
    const isAdminLoginPath = path === "/auth/admin-login";
    const isUserLoginPath = path === "/auth/login";
    const isProtectedUserPath =
      path === "/profile" || path.startsWith("/order/");

    // 1) Protect admin pages: only admin can access
    if (isAdminPath && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/admin-login", req.url));
    }

    // 2) Logged-in admin should not see admin login page
    if (isAdminLoginPath && token?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // 3) Logged-in users should not see normal login page
    if (isUserLoginPath && token) {
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // 4) Protect user pages: profile and order details require login
    if (isProtectedUserPath && !token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    // Keep true so custom rules above decide all redirects
    callbacks: { authorized: () => true },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/login",
    "/auth/admin-login",
    "/profile",
    "/order/:path*",
  ],
};
