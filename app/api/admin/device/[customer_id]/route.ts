import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function getTbToken(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found");
  }

  const token = session.user?.tb_token;

  if (!token) {
    throw new Error("TB token missing in session");
  }

  return token;
}

export async function GET(req: NextRequest, context: any) {
  try {
    // 🔥 FIX: await params
    const params = await context.params;
    const customer_id = params.customer_id;

    // console.log("Customer ID:", customer_id);

    // 1️⃣ Get TB token
    const token = await getTbToken();

    // 2️⃣ Fetch devices of customer
    const tbRes = await fetch(
      `https://dashboard.senselive.io/api/customer/${customer_id}/deviceInfos?pageSize=100&page=0`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!tbRes.ok) throw new Error("Failed to fetch TB devices");

    const devices = await tbRes.json();

    // 3️⃣ Return devices
    return NextResponse.json({
      success: true,
      devices: devices.data,
      total: devices.totalElements,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
