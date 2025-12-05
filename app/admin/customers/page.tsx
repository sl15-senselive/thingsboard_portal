"use client";
import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

const Page = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // ⬅ loading state
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomers(data.customers);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center">
      <AdminNavbar />

      <div className="w-full h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Customer Details</h2>
          </div>

          {/* --------------------- LOADING STATE ---------------------- */}
          {loading && (
            <div className="p-6 text-center text-gray-600 animate-pulse">
              Loading customers...
            </div>
          )}

          {/* ----------------------- ERROR STATE ----------------------- */}
          {!loading && error && (
            <div className="p-6 text-center text-red-600 font-medium">
              Failed to load customer data.
            </div>
          )}

          {/* ----------------------- EMPTY STATE ---------------------- */}
          {!loading && !error && customers.length === 0 && (
            <div className="p-6 text-center text-gray-600 font-medium">
              No customer data found.
            </div>
          )}

          {/* ----------------------- TABLE ---------------------------- */}
          {!loading && !error && customers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Created Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Licenses Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Total Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {new Date(c.createdTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">{c.title}</td>
                      <td className="px-6 py-4 text-sm">{c.email}</td>
                      <td className="px-6 py-4 text-sm">{c.city}</td>
                      <td className="px-6 py-4 text-sm">{c.phone}</td>
                      <td className="px-6 py-4 text-sm">{c.license_count}</td>
                      <td className="px-6 py-4 text-sm">₹{c.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
