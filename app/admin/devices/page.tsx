"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import {
  IndianRupee,
  Settings,
  ShoppingCart,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const [ordersData, setOrdersData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  function toLocalISTDate(timestamp: number) {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) return "Invalid timestamp";

    const day = String(
      new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(date)
    );

    const month = String(
      new Intl.DateTimeFormat("en-IN", {
        month: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(date)
    );

    const year = String(
      new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(date)
    );

    return `${day}/${month}/${year}`;
  }

  async function fetchDevices() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/device", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        toast.error("Failed to fetch devices");
        setOrdersData([]);
        return;
      }

      const { data } = await res.json();

      const sorted = data?.sort(
        (a: any, b: any) => Number(b.created_time) - Number(a.created_time)
      );

      setOrdersData(sorted);
    } catch (error) {
      console.error(error);
      setOrdersData([]);
    } finally {
      setLoading(false);
    }
  }

  const [showModal, setShowModal] = React.useState(false);
  const [selectedCreds, setSelectedCreds] = React.useState<any>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  function openCreds(creds: any) {
    setSelectedCreds(JSON.parse(creds));
    setShowPassword(false);
    setShowModal(true);
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center">
      <AdminNavbar />

      <div className="w-full h-screen p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Customers
              </h3>
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold">215</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Active Devices
              </h3>
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold">5678</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Monthly Devices
              </h3>
              <IndianRupee className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold">₹45678.12</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Devices
              </h3>
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold">156</div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Customers Details
            </h2>
          </div>

          <div className="overflow-x-auto transition-all duration-700 ease-in-out">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Device Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Credentials
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">

                {/* Loading Skeleton */}
                {loading &&
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))}

                {/* No Data */}
                {!loading && ordersData?.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-500 text-sm"
                    >
                      No device records found
                    </td>
                  </tr>
                )}

                {/* Actual Data */}
                {!loading &&
                  ordersData &&
                  ordersData.map((order) => (
                    <tr
                      key={order.created_time}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {toLocalISTDate(order.created_time)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.device_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600">
                        <button
                          onClick={() => openCreds(order.credentials)}
                          className="underline hover:text-blue-800"
                        >
                          View Credentials
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Credentials Modal */}
      {showModal && selectedCreds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Credentials</h2>

            {/* Username */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">
                Username
              </label>
              <div className="mt-1 w-full p-2 border rounded-lg bg-gray-50 text-gray-800">
                {selectedCreds.userName}
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="mt-1 flex items-center p-2 border rounded-lg bg-gray-50">
                <input
                  type={showPassword ? "text" : "password"}
                  value={selectedCreds.password}
                  readOnly
                  className="bg-transparent w-full outline-none"
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              className="mt-3 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
