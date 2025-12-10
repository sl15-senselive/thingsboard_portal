import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customer_id = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0";
    const payments = await pool.query(
      "SELECT * FROM payments where customer_id = $1",
      [customer_id]
    );
    // console.log(payments.rows);

    return NextResponse.json(
      {
        payments: payments.rows,
        message: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error getting payments", error);
    return NextResponse.json(
      {
        message: "error getting payments",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "Payment id required" },
        { status: 400 }
      );
    }
    const result = await pool.query(
      "UPDATE payments SET expiry_date = expiry_date + INTERVAL '1 year' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: result.rows[0],
        message: "Payment updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
