import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1️⃣ Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No session found" },
        { status: 401 }
      );
    }

    const user = session.user;
    console.log(user);

    // 2️⃣ Fetch user from PostgreSQL
    const result = await pool.query(
      "SELECT customer_id, email, firstname, lastname, phone_number FROM users WHERE _id = $1",
      [user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userData = result.rows[0];

    // 3️⃣ Get TB Token
    const token = session.user?.tb_token;

    // 4️⃣ Fetch TB Customer Info

    // -------- SAFE JSON PARSER --------
    let tbJson: any = [];
    const tbRes = await fetch(
      `https://dashboard.senselive.io/api/customer/${userData.customer_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      }
    );
    if (tbRes.ok) {
      tbJson = await tbRes.json();
    }
    // 5️⃣ Final Response (merged)
    return NextResponse.json(
      {
        success: true,
        data: {
          user: userData,
          customer: tbJson,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
