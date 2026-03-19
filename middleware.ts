import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user tries to access /admin but isn't an admin
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextUrl.pathname !== "/admin/login" && // Let them access the login page
      req.nextauth.token?.role !== "admin"
    ) {
      // Redirect non-admins trying to access admin back to admin login
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // You could also add user protections here (e.g. for /checkout)
    // if (req.nextUrl.pathname.startsWith("/checkout") && !req.nextauth.token) {
    //   return NextResponse.redirect(new URL("/auth/login", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      // The middleware function is only invoked if this returns true
      authorized: ({ token }) => !!token,
    },
    // We point this to our public login page if token is null, but we handled the redirect natively above too
    pages: {
      signIn: "/admin/login",
    },
  }
);

// Define the paths where the middleware should run
export const config = {
  matcher: [
    /*
     * Match all request paths under /admin
     * Exclude the api routes if any exist under there, or static files
     */
    "/admin/:path*",
    // "/checkout/:path*" // Un-comment when you're ready to protect user checkout
  ],
};