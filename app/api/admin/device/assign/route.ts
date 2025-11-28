import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { deviceId, customerId } = await request.json();
  try {
    const resLogin = await fetch(
      "https://dashboard.senselive.io/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: process.env.SENSELIVE_API_USER,
          password: process.env.SENSELIVE_API_PASSWORD,
        }),
      }
    );

    if (!resLogin.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Login failed",
          details: await resLogin.text(),
        },
        { status: resLogin.status }
      );
    }

    const loginData = await resLogin.json();
    const token = loginData.token;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token received from login",
        },
        { status: 401 }
      );
    }

    const assignRes = await fetch(`https://dashboard.senselive.io/api/customer/${customerId}/device/${deviceId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    if (!assignRes.ok) {
        const errorText = await assignRes.text();
        console.error("Error assigning device to customer:", errorText);
        return new Response(JSON.stringify({ error: "Failed to assign device to customer" }), {
            status: assignRes.status,
        });
    }

    const updateQuery =
      "UPDATE device SET is_assigned = true WHERE device_id = $1 RETURNING *";
    const { rows } = await pool.query(updateQuery, [deviceId]);
    const updatedDevice = rows[0];

    if (!updatedDevice) {
      return new Response(JSON.stringify({ error: "Device not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Device assigned successfully",
        device: updatedDevice,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning device:", error);
    return new Response(JSON.stringify({ error: "Failed to assign device" }), {
      status: 500,
    });
  }
}
