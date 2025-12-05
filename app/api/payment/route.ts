import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customer_id = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0"
    const payments = await pool.query("SELECT * FROM payments where customer_id = $1", [customer_id]);
    // console.log(payments.rows);
    
    return NextResponse.json({
      payments: payments.rows,
      message: "success",
    }, { status: 200 });
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
