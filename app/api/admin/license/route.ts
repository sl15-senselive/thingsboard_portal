import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/* -------------------------------------------------------
    TOKEN CACHE
-------------------------------------------------------- */
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0; // timestamp in ms

/* -------------------------------------------------------
    LOGIN TO THINGSBOARD (WITH CACHING)
-------------------------------------------------------- */
async function getTbToken() {
  const now = Date.now();

  // ⭐ Reuse token if still valid (TB token expires in 15min)
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const res = await fetch("https://dashboard.senselive.io/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.SENSELIVE_API_USER,
        password: process.env.SENSELIVE_API_PASSWORD,
      }),
    });

    if (!res.ok) {
      console.error("❌ ThingsBoard Login Failed");
      cachedToken = null;
      return null;
    }

    const json = await res.json();
    cachedToken = json.token;

    // TB token validity = 15 minutes → set expiry at 14min for safe refresh
    tokenExpiresAt = Date.now() + 14 * 60 * 1000;

    console.log("🔐 New TB token fetched");
    return cachedToken;
  } catch (error) {
    console.error("❌ TB Login Error:", error);
    cachedToken = null;
    return null;
  }
}

/* -------------------------------------------------------
    FETCH CUSTOMER NAME
-------------------------------------------------------- */
async function getCustomerName(customerId: string) {
  try {
    const token = await getTbToken();
    if (!token) return "Unknown";

    const res = await fetch(
      `https://dashboard.senselive.io/api/customer/${customerId}`,
      {
        method: "GET",
        headers: {
          "X-Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return "Unknown";

    const json = await res.json();
    return json.title || "Unknown";
  } catch (err) {
    console.error("❌ Failed to fetch customer name", err);
    return "Unknown";
  }
}

/* -------------------------------------------------------
    GET ALL LICENSES (with customer names)
-------------------------------------------------------- */
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT 
        *
      FROM licenses`
    );

    const rows = result.rows;

    // ⭐ Only 1 login, then reuse token for all customers
    const enriched = await Promise.all(
      rows.map(async (row) => ({
        ...row,
        customer_name: await getCustomerName(row.customer_id),
      }))
    );

    return NextResponse.json(
      { data: enriched, message: "License fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error while fetching license:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------
    ASSIGN LICENSE
-------------------------------------------------------- */
export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "License id required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "UPDATE licenses SET is_assigned = TRUE, used_license = 0 WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "License not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: result.rows[0], message: "License assigned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error while updating license:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
