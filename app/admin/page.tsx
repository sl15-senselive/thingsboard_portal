"use client";

import Sidebar from "@/components/AdminNavbar";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Settings,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";

export default function Page() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [devices, setDevices] = useState<any>({});
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  /* ---------------- FETCH CUSTOMERS ---------------- */
  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoadingCustomers(true);
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoadingCustomers(false);
    }
  }

  /* ---------------- FETCH DEVICES FOR A CUSTOMER ---------------- */
  async function fetchDevices(customerId: string) {
    try {
      setLoadingDevices(true);

      // Fetch only once per customer (cache)
      if (!devices[customerId]) {
        const res = await fetch(`/api/admin/device/${customerId}`);
        const data = await res.json();
        console.log(data);
        setDevices((prev: any) => ({ ...prev, [customerId]: data.devices }));
      }

      // Toggle expand
      setExpandedRow(expandedRow === customerId ? null : customerId);
    } catch (error) {
      console.error("Device fetch error:", error);
    } finally {
      setLoadingDevices(false);
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Customers Dashboard</h1>

        {/* --------------------------------------------------------- */}
        {/*                       LOADING CUSTOMERS                  */}
        {/* --------------------------------------------------------- */}
        {loadingCustomers ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* ------------------ STATS BOXES ---------------------- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-3xl font-bold mt-2">{customers.length}</p>
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Active Devices</p>
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-3xl font-bold mt-2">5678</p>
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <IndianRupee className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-3xl font-bold mt-2">₹45678.12</p>
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Pending</p>
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-3xl font-bold mt-2">156</p>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/*                CUSTOMER TABLE + ROW ACCORDION             */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left">Customer</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Licenses</th>
                    <th className="py-3 px-4 text-right"></th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((c) => (
                    <React.Fragment key={c.id}>
                      {/* MAIN CUSTOMER ROW */}
                      <tr
                        className="border-b hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => fetchDevices(c.id)}
                      >
                        <td className="py-3 px-4 font-medium">{c.title}</td>
                        <td className="py-3 px-4">{c.email}</td>
                        <td className="py-3 px-4">{c.phone}</td>
                        <td className="py-3 px-4">{c.license_count}</td>
                        <td className="py-3 px-4 text-right">
                          {expandedRow === c.id ? (
                            <ChevronDown className="w-5 h-5 inline" />
                          ) : (
                            <ChevronRight className="w-5 h-5 inline" />
                          )}
                        </td>
                      </tr>

                      {/* EXPANDED ROW */}
                      {expandedRow === c.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={5} className="p-4">

                            {/* DEVICE LOADING */}
                            {loadingDevices ? (
                              <div className="flex items-center gap-2 text-gray-500">
                                <div className="animate-spin h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                Loading devices...
                              </div>
                            ) : devices[c.id] && devices[c.id].length > 0 ? (
                              <table className="w-full text-sm bg-white border rounded-lg shadow-sm">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="px-3 py-2 text-left">Device Name</th>
                                    <th className="px-3 py-2 text-left">Device Type</th>
                                    <th className="px-3 py-2 text-left">Label</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                    <th className="px-3 py-2 text-left">Created</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {devices[c.id].map((d: any) => (
                                    <tr key={d.id.id} className="border-b hover:bg-gray-50">
                                      <td className="px-3 py-2">{d.name}</td>
                                      <td className="px-3 py-2">{d.type}</td>
                                      <td className="px-3 py-2">{d.label || "—"}</td>
                                      <td className="px-3 py-2">{d.active ? "Active" : "Inactive"}</td>
                                      <td className="px-3 py-2">
                                        {new Date(d.createdTime).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-gray-500 text-sm">No devices found for this customer.</p>
                            )}

                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
