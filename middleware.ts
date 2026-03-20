import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getHost(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  ).toLowerCase();
}

function getProtocol(req: NextRequest) {
  return (req.headers.get("x-forwarded-proto") || "https").toLowerCase();
}

function splitHostAndPort(host: string) {
  const [hostname, port] = host.split(":");
  return { hostname, port };
}

function getRootDomain(hostname: string) {
  if (hostname.startsWith("admin.")) return hostname.slice(6);
  if (hostname.startsWith("www.")) return hostname.slice(4);
  return hostname;
}

function isLocal(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export default withAuth(
  function middleware(req: NextRequest) {
    const token = (req as any).nextauth?.token;
    const path = req.nextUrl.pathname;

    const rawHost = getHost(req);
    const { hostname, port } = splitHostAndPort(rawHost);
    const protocol = getProtocol(req);

    const adminHost = isLocal(hostname)
      ? `${hostname}${port ? `:${port}` : ""}`
      : `admin.${getRootDomain(hostname)}${port ? `:${port}` : ""}`;

    const isAdminSubdomain = hostname.startsWith("admin.");
    const isDirectAdminPath = path.startsWith("/admin");

    const isUserLoginPath = path === "/auth/login";
    const isAdminLoginPath = path === "/auth/admin-login" || path === "/login";

    const isProtectedUserPath =
      path === "/profile" || path.startsWith("/order/");

    // ================= USER DOMAIN =================
    if (!isAdminSubdomain) {
      if (isDirectAdminPath || path === "/auth/admin-login") {
        const mappedPath = isDirectAdminPath
          ? path.replace(/^\/admin/, "") || "/"
          : "/login";

        return NextResponse.redirect(`${protocol}://${adminHost}${mappedPath}`);
      }

      if (isUserLoginPath && token) {
        if (token.role === "admin") {
          return NextResponse.redirect(`${protocol}://${adminHost}/`);
        }
        return NextResponse.redirect(new URL("/profile", req.url));
      }

      if (isProtectedUserPath && !token) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    }

    // ================= ADMIN DOMAIN =================

    if (isDirectAdminPath) {
      const cleanPath = path.replace(/^\/admin/, "") || "/";
      return NextResponse.redirect(`${protocol}://${adminHost}${cleanPath}`);
    }

    if (path === "/login") {
      return NextResponse.rewrite(new URL("/auth/admin-login", req.url));
    }

    if (!isAdminLoginPath && token?.role !== "admin") {
      return NextResponse.redirect(`${protocol}://${adminHost}/login`);
    }

    if (isAdminLoginPath && token?.role === "admin") {
      return NextResponse.redirect(`${protocol}://${adminHost}/`);
    }

    if (!isAdminLoginPath) {
      const target = `/admin${path === "/" ? "" : path}`;
      return NextResponse.rewrite(new URL(target, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: { authorized: () => true },
  },
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
