"use client";

import { Sidebar } from "@/components/Sidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      getProfileData();
    }
  }, [status]);

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  const role = session?.user?.role;

  async function getProfileData() {
    try {
      const res = await fetch("/api/profile");
      const json = await res.json();

      if (json.success) setProfile(json.data);
    } catch (error) {
      console.error("Get Profile Data Error:", error);
    }
  }

  if (!profile) {
    return <div className="p-8">Fetching profile...</div>;
  }

  const customer = profile.customer; // company info
  const user = profile.user;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {role === "admin" ? <AdminNavbar /> : null}
      {role === "user" ? <Sidebar /> : null}

      <div className="w-full p-8 space-y-6">
        {/* -------------------- USER DATA -------------------- */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4"> User Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>First Name:</strong> {user.firstname}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastname}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone_number || "—"}
            </p>
          </div>
        </div>
        {/* -------------------- COMPANY DATA -------------------- */}
        {/* -------------------- COMPANY DATA -------------------- */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>

          {/* ❌ No company data → show message */}
          {!customer ||
          Array.isArray(customer) ||
          Object.keys(customer).length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800">
              <p className="font-medium mb-2">No company profile found.</p>
              <p className="mb-4">Please register your company to continue.</p>

              <a
                href="/register"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Register Company
              </a>
            </div>
          ) : (
            // ✅ Company Data exists
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Company Name:</strong> {customer.title}
              </p>
              <p>
                <strong>Company Email:</strong> {customer.email || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone || "—"}
              </p>
              <p>
                <strong>City:</strong> {customer.city || "—"}
              </p>
              <p>
                <strong>State:</strong> {customer.state || "—"}
              </p>
              <p>
                <strong>Country:</strong> {customer.country || "—"}
              </p>
              <p>
                <strong>Address:</strong> {customer.address || "—"}
              </p>
              <p>
                <strong>Zip:</strong> {customer.zip || "—"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
