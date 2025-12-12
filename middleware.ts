import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow NextAuth internal routes
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // ============================
    // 🔐 API PROTECTION
    // ============================

    // ❌ Block all /api/* if NOT logged in
    if (pathname.startsWith("/api") && !pathname.startsWith("/api/admin")) {
      if (!token) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    // ❌ Block /api/admin/* if NOT admin
    if (pathname.startsWith("/api/admin")) {
      if (!token || token.role !== "admin") {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    // ============================
    // 🔐 PAGE PROTECTION
    // ============================

    // Public pages
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/auth"
    ) {
      return NextResponse.next();
    }

    // Protect /admin pages
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    }

    // Protect /dashboard and /cart pages
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // we handle manually
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
