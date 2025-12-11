"use client";
import { Sidebar } from "@/components/Sidebar";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const res = await fetch("/api/payment");
      const { payments } = await res.json();
      const sortedPayments = payments.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      setPayments(sortedPayments);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(ts: string) {
    const date = new Date(ts);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  function getExpiryColor(expiry: string) {
    const now = new Date();
    const exp = new Date(expiry);
    const diff = exp.getTime() - now.getTime();
    const daysLeft = diff / (1000 * 60 * 60 * 24);

    if (daysLeft <= 0) return "text-red-600 font-bold"; // expired
    if (daysLeft <= 30) return "text-yellow-600 font-bold"; // < 30 days
    return "text-green-600 font-bold"; // safe
  }

  async function payBill(id: string) {
    try {
      const res = await fetch("/api/payment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      console.log(res.json());

      fetchPayments();
    } catch (err) {
      console.error("Payment Failed", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="w-full p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payments</h1>

        {loading && <div>Loading...</div>}

        {!loading && payments.length === 0 && (
          <div className="text-gray-600 mt-8">No payment records found.</div>
        )}

        {!loading && payments.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Next Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {payments.map((p) => {
                  return (
                    <tr key={p.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {p.customer_name}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        ₹{p.price}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(p.created_at)}
                      </td>

                      <td
                        className={`px-6 py-4 text-sm ${getExpiryColor(
                          p.expiry_date
                        )}`}
                      >
                        {formatDate(p.expiry_date)}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {!p.is_paid ? (
                          <div className="space-y-1 flex flex-col items-start">
                            <button
                              onClick={() => payBill(p.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Pay Now
                            </button>

                            <p className="text-xs text-gray-600 max-w-[180px] leading-relaxed">
                              Paying will increase your license expiry date to 1
                              year.
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
