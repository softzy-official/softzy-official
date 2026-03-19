import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. If trying to access /admin routes without an admin token
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/admin-login", req.url));
    }

    // 2. If ALREADY logged in as admin, prevent them from seeing admin-login page again
    if (path === "/auth/admin-login" && token?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function above handle the exact redirects, don't use boolean block here
    },
  }
);

// Define exactly where middleware should run
export const config = {
  matcher: [
    "/admin/:path*", 
    "/auth/admin-login"
  ],
};