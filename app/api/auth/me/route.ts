// app/api/auth/me/route.ts (Next.js App router)
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: NextRequest) {
  try {
    // If you store token cookie name "token"
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(^|; )token=([^;]+)/);
    const token = match ? decodeURIComponent(match[2]) : null;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ authenticated: false }, { status: 403 });
    }

    // fetch user by id (or email) from DB, but avoid returning password
    const result = await pool.query(
      "SELECT id, firstname, lastname, email FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ authenticated: false }, { status: 404 });
    }

    return NextResponse.json(
      { authenticated: true, user: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth/me error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
