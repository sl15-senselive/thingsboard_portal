import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const q = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(q, [email]);
    const existingUser = rows[0];

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // await User.create({
    //   email,
    //   password,
    // });
    const insertQuery =
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
    await pool.query(insertQuery, [email, password]);
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
