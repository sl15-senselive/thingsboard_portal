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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No session found" },
        { status: 401 }
      );
    }
    const user = session.user;
    // console.log("user",user);

    const customer = await pool.query(
      "select customer_id from users where _id = $1",
      [user?.id]
    );
    // console.log("customer",customer);

    // const customerId = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0"
    const customer_id = customer.rows[0].customer_id;

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
    const { package_name, price, total_license } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No session found" },
        { status: 401 }
      );
    }
    const user = session.user;
    // console.log("user",user);

    const customer = await pool.query(
      "select customer_id from users where _id = $1",
      [user?.id]
    );
    // console.log("customer",customer);

    // const customerId = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0"
    const customer_id = customer.rows[0].customer_id;
    // 1️⃣ Create license
    const result = await pool.query(
      "INSERT INTO licenses (customer_id, package_name, price, total_license) VALUES ($1, $2, $3, $4) RETURNING *",
      [customer_id, package_name, price, total_license]
    );

    const license = result.rows[0];
    const license_id = license.id;

    // 2️⃣ Create payment record using the LICENSE ID
    const customer_name = await getTbCustomerNameById(
      await getTbToken(),
      customer_id
    );
    const paymentsResult = await pool.query(
      `
      INSERT INTO payments (customer_id, customer_name, price, license_id,expiry_date)
      VALUES ($1, $2, $3, $4,$5)
      RETURNING *;
      `,
      [
        customer_id,
        customer_name,
        license.price,
        license_id,
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      ]
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
