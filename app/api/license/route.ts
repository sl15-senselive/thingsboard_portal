import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function getTbToken() {
  const res = await fetch("https://dashboard.senselive.io/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.SENSELIVE_API_USER,
      password: process.env.SENSELIVE_API_PASSWORD,
    }),
  });
  
  const json = await res.json();
  return json.token;
}

async function getTbCustomerNameById(token: string, customerId: string) {
  try {
    const res = await fetch(
      `https://dashboard.senselive.io/api/customer/${customerId}`,
      {
        headers: { "X-Authorization": `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch customer:", await res.text());
      return null;
    }
    
    const json = await res.json();
    return json.title || null;
  } catch (err) {
    console.error("Error fetching customer:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const customer_id = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0";
    const result = await pool.query(
      "SELECT * FROM licenses WHERE customer_id = $1 ORDER BY purchased_time DESC",
      [customer_id]
    );
    const license = result.rows;
    
    if (!license || license.length === 0) {
      return NextResponse.json(
        { message: "License not found" },
        { status: 404 }
      );
    }

    // Return only the license data without calculations
    return NextResponse.json(
      {
        data: license,
        message: "License fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching license : ", error);
    return NextResponse.json(
      { message: error || "Internal Server Error" },
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
      "UPDATE licenses SET is_assigned = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "License not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: result.rows[0],
        message: "License assigned successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating license : ", error);
    return NextResponse.json(
      { message: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customer_id, package_name, price, total_license } =
      await req.json();

    // 1️⃣ Create license
    const result = await pool.query(
      "INSERT INTO licenses (customer_id, package_name, price, total_license) VALUES ($1, $2, $3, $4) RETURNING *",
      [customer_id, package_name, price, total_license]
    );

    const license = result.rows[0];
    const license_id = license.id;

    // 2️⃣ Create payment record using the LICENSE ID
    const customer_name = await getTbCustomerNameById(await getTbToken(), customer_id)
    const paymentsResult = await pool.query(
      `
      INSERT INTO payments (customer_id, customer_name, price, license_id)
      VALUES ($1, $2, $3, $4)
      `,
      [customer_id, customer_name, license.price, license_id] 
    );
    
    if (paymentsResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Payment record creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: license,
        message: "License created successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error while fetching license : ", error);
    return NextResponse.json(
      { message: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}