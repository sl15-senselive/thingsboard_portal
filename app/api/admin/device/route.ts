import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ---------------- POST ----------------
export async function POST(request: NextRequest) {
  try {
    const { name, username, password } = await request.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No session found" },
        { status: 401 }
      );
    }
    const user = session.user;
    const token = session.user.tb_token;

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No session found" },
        { status: 401 }
      );
    }
    const user = session.user;
    const token = session.user.tb_token;
    // -------------------------------------------------------------
    // 2) Fetch ALL devices with state included (SUPER OPTIMIZED)
    // -------------------------------------------------------------
    let page = 0;
    let hasNext = true;
    const allDevices: any[] = [];

    while (hasNext) {
      const resDevices = await fetch(
        `https://dashboard.senselive.io/api/tenant/devices?fetch=true&pageSize=100&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await resDevices.json();

      if (Array.isArray(json.data)) {
        allDevices.push(...json.data);

        hasNext = json.hasNext ?? false;
      } else {
        hasNext = false;
      }

      page++;
    }

    // -------------------------------------------------------------
    // 3) ENRICH device with customer + credentials
    // -------------------------------------------------------------
    const enrichedDevices = await Promise.all(
      allDevices.map(async (d) => {
        try {
          // Customer name
          let customerName = "Unassigned";
          if (d.customerId?.id) {
            const custRes = await fetch(
              `https://dashboard.senselive.io/api/customer/${d.customerId.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const customerInfo = await custRes.json();
            customerName = customerInfo.title;
          }

          // Credentials
          const credsRes = await fetch(
            `https://dashboard.senselive.io/api/device/${d.id.id}/credentials`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const creds = await credsRes.json();

          return {
            device_id: d.id.id,
            device_name: d.name,
            created_time: d.createdTime,

            // 🌟 NEW: Active state (from fetch=true)
            active: d.deviceInfo?.active ?? false,
            last_activity: d.deviceInfo?.lastActivityTime ?? null,

            customer_id: d.customerId?.id || null,
            customer_name: customerName,

            credentials: creds.credentialsValue,
          };
        } catch (err) {
          console.log("Error enriching device:", err);
          return { ...d, tb_error: "Failed to fetch" };
        }
      })
    );

    return NextResponse.json(
      { success: true, count: enrichedDevices.length, data: enrichedDevices },
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
