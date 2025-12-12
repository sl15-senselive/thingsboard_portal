import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ---------------------- 1. Get TB Token ---------------------- */
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

/* ---------------------- 2. GET TB Customers ---------------------- */
async function getTbCustomers(token: string) {
  const res = await fetch(
    "https://dashboard.senselive.io/api/customers?page=0&pageSize=1000",
    {
      headers: { "X-Authorization": `Bearer ${token}` },
    }
  );

  const json = await res.json();
  return json.data || [];
}

/* ---------------------- 3. Get phone number attribute ---------------------- */
async function getPhoneNumber(token: string, customerId: string) {
  try {
    const url = `https://dashboard.senselive.io/api/plugins/telemetry/ENTITY_GROUP/CUSTOMER/${customerId}/values/attributes`;
    const res = await fetch(url, {
      headers: { "X-Authorization": `Bearer ${token}` },
    });

    const json = await res.json();
    const phoneAttr = json.find((x: any) => x.key === "phone");
    return phoneAttr?.value || "N/A";
  } catch {
    return "N/A";
  }
}

/* ---------------------- 4. GET Licenses from PG ---------------------- */
async function getLicenseStats(customerId: string) {
  const result = await pool.query(
    "SELECT COUNT(*) AS count, COALESCE(SUM(price),0) AS total_price FROM licenses WHERE customer_id = $1 AND is_assigned = TRUE",
    [customerId]
  );

  return {
    license_count: Number(result.rows[0].count),
    total_price: Number(result.rows[0].total_price),
  };
}

/* ---------------------- 5. GET API ---------------------- */
export async function GET() {
  try {
    const token = await getTbToken();
    if (!token)
      return NextResponse.json({ success: false, message: "TB login failed" });

    const customers = await getTbCustomers(token);

    // Enrich data
    const enriched = await Promise.all(
      customers.map(async (c: any) => {
        const phone = await getPhoneNumber(token, c.id.id);
        const stats = await getLicenseStats(c.id.id);

        return {
          id: c.id.id,
          title: c.title,
          createdTime: c.createdTime,
          email: c.email || "N/A",
          city: c.city || "N/A",
          phone,
          license_count: stats.license_count,
          total_price: stats.total_price,
        };
      })
    );

    // Sort by created time (latest first)
    enriched.sort((a, b) => b.createdTime - a.createdTime);
    // console.log("Fetched customers:", enriched);
    return NextResponse.json({
      success: true,
      customers: enriched,
    });
  } catch (err) {
    console.log("Error fetching customers:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
