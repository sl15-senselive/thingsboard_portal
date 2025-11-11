import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // ✅ Always allow NextAuth API routes and auth pages
    if (
      pathname.startsWith("/api/auth") ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/auth"
    ) {
      return NextResponse.next();
    }

    // ✅ Protect /admin (require admin role)
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/auth", req.url));
      }
      return NextResponse.next();
    }

    // ✅ Protect /dashboard and /cart (require login)
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/cart")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url));
      }
      return NextResponse.next();
    }

    // ✅ Allow all other routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization manually above
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
