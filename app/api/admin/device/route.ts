import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// ---------------- POST ----------------
export async function POST(request: NextRequest) {
  try {
    const { name, username, password } = await request.json();

    // Step 1 — LOGIN
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

    // Step 2 — Create device with credentials
    const res = await fetch(
      "https://dashboard.senselive.io/api/device-with-credentials",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          device: {
            name: name,
            label: "",
            deviceProfileId: {
              id: "1b5e3410-50fa-11f0-9c46-b702b4c0da00",
              entityType: "DEVICE_PROFILE",
            },
          },
          credentials: {
            credentialsType: "MQTT_BASIC",
            credentialsValue: `{"clientId":"","userName":"${username}","password":"${password}"}`,
          },
        }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create device",
          status: res.status,
          details: result,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Device created successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const res = await pool.query(
      "SELECT * FROM device ORDER BY created_at DESC"
    );
    const devices = res.rows;

    const enrichedDevices = await Promise.all(
      devices.map(async (d) => {
        try {
          const deviceRes = await fetch(
            `https://dashboard.senselive.io/api/device/${d.device_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const deviceInfo = await deviceRes.json();

          // B) Customer info
          const customerRes = await fetch(
            `https://dashboard.senselive.io/api/customer/${d.customer_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const customerInfo = await customerRes.json();

          // C) Credentials
          const credsRes = await fetch(
            `https://dashboard.senselive.io/api/device/${d.device_id}/credentials`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const creds = await credsRes.json();

          return {
            ...d,
            created_at: d.created_at,
            device_name: deviceInfo.name,
            customer_name: customerInfo.title,
            credentials: creds.credentialsValue,
          };

        } catch (err) {
          console.log("TB fetch error:", err);
          return { ...d, tb_error: "Failed to fetch TB data" };
        }
      })
    );
    console.log(enrichedDevices);

    return NextResponse.json(
      { success: true, data: enrichedDevices },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET DEVICE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected error", details: String(error) },
      { status: 500 }
    );
  }
}
