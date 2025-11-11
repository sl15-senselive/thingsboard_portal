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
};


export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, specs, image, category, price } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (specs !== undefined) {
      const specsArray = Array.isArray(specs)
        ? specs
        : typeof specs === "string"
        ? specs.split(",").map((s) => s.trim())
        : [];
      updates.push(`specs = $${paramCount++}`);
      values.push(specsArray);
    }
    if (image !== undefined) {
      updates.push(`image = $${paramCount++}`);
      values.push(image);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(category);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(price);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add ID as the last parameter
    values.push(id);

    const result = await pool.query(
      `
      UPDATE products 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *;
      `,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "✅ Product updated successfully", product: result.rows[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully", product: result.rows[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}