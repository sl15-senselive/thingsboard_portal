"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminNavbar from "@/components/AdminNavbar";

interface LicensePackage {
  id: string;
  customer_id: string;
  customer_name: string;
  package_name: string;
  total_license: number;
  price: number;
  purchased_time: string;
  is_assigned: boolean;
}

export default function AdminPage() {
  const [packages, setPackages] = useState<LicensePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/license");
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Failed to fetch packages");
        return;
      }

      setPackages(json.data || []);
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function assignLicense(id: string) {
    try {
      const res = await fetch("/api/admin/license", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Failed to assign");
        return;
      }

      toast.success("License assigned successfully");

      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === id ? { ...pkg, is_assigned: true } : pkg
        )
      );
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  }

  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">All Customer Packages</h1>

        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Customer Name</th>
                <th className="px-4 py-3 text-left">Package Name</th>
                <th className="px-4 py-3 text-left">Total License</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Purchased Time</th>
                <th className="px-4 py-3 text-left">Assigned?</th>
                <th className="px-4 py-3 text-center">Assign</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING SKELETON */}
              {loading &&
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse border-t">
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))}

              {/* NO DATA */}
              {!loading && packages.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No packages found
                  </td>
                </tr>
              )}

              {/* ACTUAL DATA */}
              {!loading &&
                packages.map((pkg) => (
                  <tr key={pkg.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{pkg.customer_name}</td>
                    <td className="px-4 py-3">{pkg.package_name}</td>
                    <td className="px-4 py-3">{pkg.total_license}</td>
                    <td className="px-4 py-3">₹{pkg.price}</td>

                    <td className="px-4 py-3">
                      {new Date(pkg.purchased_time).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3">
                      {pkg.is_assigned ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                          Assigned
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {pkg.is_assigned ? (
                        <button
                          disabled
                          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded cursor-not-allowed"
                        >
                          Assigned
                        </button>
                      ) : (
                        <button
                          onClick={() => assignLicense(pkg.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
