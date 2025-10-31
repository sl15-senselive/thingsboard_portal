import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Check if user exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const query = `
      INSERT INTO users (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING _id, firstname, lastname, email;
    `;
    const values = [firstName, lastName, email, hashedPassword];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    console.log(user);
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ User registered:", user.email);

    return NextResponse.json(
      { message: "Registration successful", user, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
