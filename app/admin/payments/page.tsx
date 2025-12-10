'use client';

import Sidebar from '@/components/AdminNavbar';
import React, { useEffect, useState } from 'react';

interface Payment {
  id: string;
  customer_id: string;
  customer_name: string;
  license_id: string;
  price: string;
  expiry_date: string;
  created_at: string;
  paid_time: string | null;
}

const Page = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/payments');
      const data = await response.json();
      console.log(data);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-semibold mb-6">Payments</h1>

        {/* LOADING SPINNER */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Created At</th>
                  <th className="py-3 px-4 text-left">Paid Time</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{p.customer_name}</td>
                    <td className="py-3 px-4">₹ {p.price}</td>
                    
                    <td className="py-3 px-4">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                    
                    <td className="py-3 px-4">
                      {p.paid_time ? new Date(p.paid_time).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
