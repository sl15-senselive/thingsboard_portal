import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone_number } =
      await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const checkQuery = "SELECT * FROM users WHERE email = $1";
    const existingUser = (await pool.query(checkQuery, [email])).rows[0];

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user (role defaults to "user")
    const insertQuery = `
      INSERT INTO users (email, password, firstname, lastname, phone_number, role)
      VALUES ($1, $2, $3, $4, $5, 'user')
      RETURNING _id, email, role
    `;

    const result = await pool.query(insertQuery, [
      email,
      hashedPassword,
      firstName,
      lastName,
      phone_number.toString(),
    ]);

    return NextResponse.json(
      { message: "User registered successfully", user: result.rows[0] },
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
