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
  is_paid: boolean; // <-- NEW
}

export default function AdminPage() {
  const [packages, setPackages] = useState<LicensePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/license");
      const json = await res.json().catch(() => ({}));
      console.log(json);

      if (!res.ok) {
        toast.error(json.message || "Failed to fetch packages");
        return;
      }

      setPackages(json.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }

  async function assignLicense(id: string) {
    try {
      setAssigningId(id);

      const res = await fetch("/api/admin/license", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(json.message || "Failed to assign");
        return;
      }

      toast.success("License assigned!");

      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === id ? { ...pkg, is_assigned: true } : pkg))
      );
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setAssigningId(null);
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
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Total License</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Purchased At</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-center">Assign</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-t">
                    {Array.from({ length: 8 }).map((_, col) => (
                      <td key={col} className="px-4 py-3">
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}

              {/* NO DATA */}
              {!loading && packages.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No packages found
                  </td>
                </tr>
              )}

              {/* DATA */}
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{pkg.customer_name}</td>
                  <td className="px-4 py-3">{pkg.package_name}</td>
                  <td className="px-4 py-3">{pkg.total_license}</td>
                  <td className="px-4 py-3">₹{pkg.price}</td>

                  <td className="px-4 py-3 text-center">
                    {new Date(pkg.purchased_time).toLocaleString("en-IN")}
                  </td>

                  {/* NEW PAYMENT STATUS */}
                

                  <td className="px-4 py-3 text-center">
                    {pkg.is_assigned ? (
                      <span className="text-green-600">Assigned</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {pkg.is_assigned ? (
                      <button
                        disabled
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
                      >
                        Assigned
                      </button>
                    ) : (
                      <button
                        onClick={() => assignLicense(pkg.id)}
                        className={`px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-700`}
                      >
                        {assigningId === pkg.id ? "Assigning..." : "Assign"}
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
