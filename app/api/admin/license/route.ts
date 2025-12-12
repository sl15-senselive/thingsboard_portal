import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function getTbToken(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found");
  }

  const token = session.user?.tb_token;

  if (!token) {
    throw new Error("TB token missing in session");
  }

  return token;
}

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
