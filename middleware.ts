import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    // ✅ Check for admin role
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Allow the request to continue
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }
}

// ✅ Apply to specific admin routes
export const config = {
  matcher: [],
};
