import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, specs, image, category, price } = body;

    if (!id || !name || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure specs is a proper array
    const specsArray = Array.isArray(specs)
      ? specs
      : typeof specs === "string"
      ? specs.split(",").map((s) => s.trim())
      : [];

    const result = await pool.query(
      `
      INSERT INTO products (id, name, description, specs, image, category, price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      [id, name, description, specsArray, image, category, price]
    );

    return NextResponse.json(
      { message: "✅ Product added successfully", product: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error inserting product:", error);
    return NextResponse.json(
      { error: "Failed to add product", details: error.message },
      { status: 500 }
    );
  }
}
