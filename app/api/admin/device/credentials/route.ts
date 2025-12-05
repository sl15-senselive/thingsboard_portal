import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {id, username, password } = await request.json();
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

    const res = await fetch(
      `https://dashboard.senselive.io/api/device/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: {
            id: id,
          },
          deviceId: {
            id: id,
            entityType: "DEVICE",
          },

          credentialsType: "MQTT_BASIC",
          credentialsValue: `{"clientId":"","userName":"${username}","password":"${password}"} `,
        }),
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error assigning device to customer:", errorText);
      return new Response(
        JSON.stringify({ error: errorText }),
        {
          status: res.status,
        }
      );
    }
    console.log(res);
    return NextResponse.json({

    })
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
