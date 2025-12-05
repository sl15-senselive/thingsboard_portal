import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const customerData = {
      country: formData.country,
      state: formData.state,
      city: formData.city,
      address: formData.address,
      address2: null,
      zip: formData.zipCode,
      phone: formData.phone,
      email: formData.email,
      title: formData.companyName,
    };

    /* ------------------------------------------------------------
     * STEP 1: LOGIN (Tenant Admin)
     * ------------------------------------------------------------ */
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
      const error = await resLogin.text();
      return NextResponse.json(
        {
          success: false,
          message: "Login failed",
          details: error,
          status: resLogin.status,
        },
        { status: resLogin.status }
      );
    }

    const loginResult = await resLogin.json();
    const token = loginResult.token;
    console.log(token);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token received from login",
          status: 401,
        },
        { status: 401 }
      );
    }

    /* ------------------------------------------------------------
     * STEP 2: CREATE CUSTOMER
     * ------------------------------------------------------------ */
    const resCustomer = await fetch(
      "https://dashboard.senselive.io/api/customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customerData),
      }
    );

    if (!resCustomer.ok) {
      const error = await resCustomer.json();
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Customer creation failed",
          details: error,
          status: resCustomer.status,
        },
        { status: resCustomer.status }
      );
    }

    const customerResult = await resCustomer.json();
    console.log(customerResult);
    const customerId = customerResult.id;
    console.log(customerId);

    if (!customerId) {
      return NextResponse.json(
        {
          success: false,
          message: "No customer ID returned",
          status: 500,
        },
        { status: 500 }
      );
    }
    const addCustomerToDB = await pool.query('INSERT INTO customers (customer_id, company_name) VALUES ($1, $2)', [customerId.id, customerResult.title]);
    
    /* ------------------------------------------------------------
     * STEP 3: CREATE USER FOR CUSTOMER
     * ------------------------------------------------------------ */
    const tempPassword = "TempSecurePass123!";

    const resUser = await fetch("https://dashboard.senselive.io/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        authority: "CUSTOMER_USER",
        email: formData.email,
        firstName: formData.firstName || "DefaultFirst",
        lastName: formData.lastName || "DefaultLast",
        password: tempPassword,
        phone: formData.phone,
        customerId: customerId,
      }),
    });

    if (!resUser.ok) {
      let errorText = await resUser.text();

      try {
        const json = JSON.parse(errorText);
        errorText = json.message || errorText;
      } catch {}

      return NextResponse.json(
        {
          success: false,
          message: "User creation failed",
          details: errorText,
          status: resUser.status,
        },
        { status: resUser.status }
      );
    }

    const userResult = await resUser.json();
    /* ------------------------------------------------------------
     * SUCCESS RESPONSE
     * ------------------------------------------------------------ */
    return NextResponse.json(
      {
        success: true,
        message: "Customer and user created successfully",
        customer: customerResult,
        user: userResult,
        tempPassword, // remove in production
        status: 201,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Unknown server error",
        status: 500,
      },
      { status: 500 }
    );
  }
}
