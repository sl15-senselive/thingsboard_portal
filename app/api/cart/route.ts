// app/api/cart/route.ts
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path to your auth config

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user_id from email
    const userResult = await pool.query(
      "SELECT _id FROM users WHERE email = $1",
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0]._id;

    // Get cart items with product details
    const cartResult = await pool.query(
      `SELECT c._id as cart_id, c.user_id, c.items, 
              p._id, p.name, p.description, p.specs, p.image, p.category, p.price
       FROM cart c
       CROSS JOIN LATERAL jsonb_array_elements_text(c.items) AS item_id
       INNER JOIN products p ON p._id = item_id::text
       WHERE c.user_id = $1`,
      [userId]
    );

    const cart = cartResult.rows.map((row) => ({
      _id: row._id, 
      name: row.name,
      description: row.description,
      specs: typeof row.specs === "string"
        ? row.specs
            .replace(/[{}"]/g, "")
            .split(",")
            .map((s: string) => s.trim())
        : row.specs || [],
      image: row.image,
      category: row.category,
      price: parseFloat(row.price),
    }));

    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();
    // console.log(request);
    
    console.log(productId);

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get user_id from email
    const userResult = await pool.query(
      "SELECT _id FROM users WHERE email = $1",
      [session.user.email]
    );
    // console.log(userResult);
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0]._id;

    // Check if cart exists for user
    const existingCart = await pool.query(
      "SELECT _id, items FROM cart WHERE user_id = $1",
      [userId]
    );

    if (existingCart.rows.length > 0) {
      // Update existing cart - append product ID to items array
      const currentItems = existingCart.rows[0].items || [];
      const updatedItems = [...currentItems, productId];

      await pool.query(
        "UPDATE cart SET items = $1 WHERE user_id = $2",
        [JSON.stringify(updatedItems), userId]
      );
    } else {
      // Create new cart
      await pool.query(
        "INSERT INTO cart (user_id, items) VALUES ($1, $2)",
        [userId, JSON.stringify([productId])]
      );
    }

    return NextResponse.json(
      { message: "Product added to cart successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();
    // console.log(productId);
    
    // Get user_id from email
    const userResult = await pool.query(
      "SELECT _id FROM users WHERE email = $1",
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0]._id;

    if (!productId) {
      // Clear entire cart
      await pool.query(
        "UPDATE cart SET items = '[]' WHERE user_id = $1",
        [userId]
      );
      return NextResponse.json(
        { message: "Cart cleared successfully" },
        { status: 200 }
      );
    }

    // Remove specific product (first occurrence)
    const cartResult = await pool.query(
      "SELECT items FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cartResult.rows.length > 0) {
      const items = cartResult.rows[0].items || [];
      const index = items.indexOf(productId);
      
      if (index > -1) {
        items.splice(index, 1);
        await pool.query(
          "UPDATE cart SET items = $1 WHERE user_id = $2",
          [JSON.stringify(items), userId]
        );
      }
    }

    return NextResponse.json(
      { message: "Product removed from cart successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart", details: error.message },
      { status: 500 }
    );
  }
}