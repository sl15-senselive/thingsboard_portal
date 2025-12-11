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
    // 1) LOGIN
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

    // -------------------------------------------------------------
    // 2) Fetch ALL devices from ThingsBoard (auto pagination)
    // -------------------------------------------------------------
    let page = 0;
    let hasNext = true;
    const allDevices: any[] = [];

    while (hasNext) {
      const resDevices = await fetch(
        `https://dashboard.senselive.io/api/tenant/devices?pageSize=100&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await resDevices.json();
      
      // console.log("TB PAGE RESPONSE:", json); // debug

      let devicesPage = [];

      // Case 1: Normal TB format
      if (Array.isArray(json.data)) {
        devicesPage = json.data;

        if (typeof json.hasNext === "boolean") {
          hasNext = json.hasNext;
        } else if (typeof json.pageDataFull === "boolean") {
          hasNext = !json.pageDataFull;
        } else {
          hasNext = false; // fallback
        }
      }

      // Case 2: Some TB servers return whole list directly
      else if (Array.isArray(json)) {
        devicesPage = json;
        hasNext = false;
      }

      // Case 3: Unexpected TB response
      else {
        return NextResponse.json(
          {
            success: false,
            message: "Unexpected ThingsBoard response format",
            response: json,
          },
          { status: 500 }
        );
      }

      allDevices.push(...devicesPage);
      page++;
    }

    // -------------------------------------------------------------
    // 3) ENRICH each device (customer + creds)
    // -------------------------------------------------------------
    const enrichedDevices = await Promise.all(
      allDevices.map(async (d) => {
        try {
          // A) Device details
          const deviceRes = await fetch(
            `https://dashboard.senselive.io/api/device/${d.id.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const deviceInfo = await deviceRes.json();

          // B) Customer
          let customerName = "Unassigned";
          if (d.customerId?.id) {
            const custRes = await fetch(
              `https://dashboard.senselive.io/api/customer/${d.customerId.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const customerInfo = await custRes.json();
            customerName = customerInfo.title;
          }

          // C) Credentials
          const credsRes = await fetch(
            `https://dashboard.senselive.io/api/device/${d.id.id}/credentials`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const creds = await credsRes.json();

          return {
            device_id: d.id.id,
            status: d.status,
            created_time: d.createdTime,
            device_name: deviceInfo.name,
            customer_id: d.customerId?.id || null,
            customer_name: customerName,
            credentials: creds.credentialsValue,
          };
        } catch (err) {
          console.log("Error enriching device:", err);
          return { ...d, tb_error: "Failed to fetch TB data" };
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
