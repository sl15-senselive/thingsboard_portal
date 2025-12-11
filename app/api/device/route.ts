import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    // console.log("user",user);
    
    const customer = await pool.query("select customer_id from users where _id = $1",[user?.id])
    // console.log("customer",customer);
    
    // const customerId = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0"
    const customerId = customer.rows[0].customer_id
    // const customerId = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0";

    // Step 0 — Check and assign license
    const licenseResult = await pool.query(
      `SELECT id, total_license, used_license 
       FROM licenses 
       WHERE used_license < total_license and is_assigned = true and customer_id = $1
       ORDER BY purchased_time ASC 
       LIMIT 1`, [customerId]
    );

    if (licenseResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No available licenses. Please purchase more licenses.",
        },
        { status: 400 }
      );
    }

    const licenseRecord = licenseResult.rows[0];
    const licenseId = licenseRecord.id;

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

    // Step 2 — Create device
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
            credentialsValue: `{"clientId":"","userName":"${username}","password":"${password}"} `,
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

    const deviceId = result.id.id;

    // Step 3 — Assign device to customer
    const assignRes = await fetch(
      `https://dashboard.senselive.io/api/customer/${customerId}/device/${deviceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!assignRes.ok) {
      const errorText = await assignRes.text();
      console.error("Error assigning device to customer:", errorText);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to assign device to customer",
          details: errorText 
        },
        { status: assignRes.status }
      );
    }

    // Step 4 — Update license (increment used_license)
    await pool.query(
      `UPDATE licenses 
       SET used_license = used_license + 1 
       WHERE id = $1`,
      [licenseId]
    );

    // Step 5 — Insert device into database
    const created_at = result.createdTime;
    const date = new Date(created_at);
    await pool.query(
      "INSERT INTO device (customer_id, device_id, created_at) VALUES ($1, $2, $3)",
      [customerId, deviceId, date]
    );

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

export async function GET() {
  try {
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
        { success: false, message: "Login failed" },
        { status: 401 }
      );
    }

    const loginData = await resLogin.json();
    const token = loginData.token;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token received from login" },
        { status: 401 }
      );
    }

    // const customerId = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0";
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No session found" },
        { status: 401 }
      );
    }
    const user = session.user;
    // console.log("user",user);
    
    const customer = await pool.query("select customer_id from users where _id = $1",[user?.id])
    // console.log("customer",customer);
    
    // const customerId = "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0"
    const customerId = customer.rows[0].customer_id
    // console.log("customerId",customerId);

    // Step 2 — GET ALL DEVICES
    const res = await fetch(
      `https://dashboard.senselive.io/api/customer/${customerId}/deviceInfos?pageSize=1000&page=0`,
      {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }
    );

    const devicesData = await res.json();
    const devices = devicesData.data || [];

    // Step 3 — For each device, fetch credentials
    const enrichedDevices = await Promise.all(
      devices.map(async (dev: any) => {
        try {
          const devId = dev.id.id;

          const credsRes = await fetch(
            `https://dashboard.senselive.io/api/device/${devId}/credentials`,
            {
              headers: { Authorization: `Bearer ${token}` },
              method: "GET",
            }
          );

          const credsData = credsRes.ok ? await credsRes.json() : null;

          return {
            ...dev,
            credentials: credsData,
          };
        } catch (err) {
          return {
            ...dev,
            credentials: null,
            error: "Failed to fetch credentials",
          };
        }
      })
    );

    return NextResponse.json(
      {
        success: true,
        devices: enrichedDevices,
      },
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