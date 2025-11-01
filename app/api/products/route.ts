import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");

    const products = result.rows.map((p:typeof products) => ({
      ...p,
      specs:
        typeof p.specs === "string"
          ? p.specs
              .replace(/[{}"]/g, "")
              .split(",")
              .map((s:string) => s.trim())
          : p.specs || [],
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}
