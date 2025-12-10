'use client';
import AdminNavbar from "@/components/AdminNavbar";
import {
  Cpu,
  FileText,
  IndianRupee,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
 
  
  
  const getStatusColor = (status: any) => {
    switch (status) {
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center">
      <div>
        <AdminNavbar />
      </div>
      <div className="w-full h-screen p-8 ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg  border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Customers
              </h3>
              <div className="">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold">215</div>
          </div>

          <div className="bg-white rounded-lg  border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Active Devices
              </h3>
              <div className="">
                {/* <FileText className="w-5 h-5 text-orange-600" /> */}
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold">5678</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Monthly Devices
              </h3>
              <div className="">
                {/* <CreditCard className="w-5 h-5 text-green-600" /> */}
                <IndianRupee className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">₹45678.12</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Devices
              </h3>
              <div className="">
                {/* <CreditCard className="w-5 h-5 text-green-600" /> */}
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold ">156</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Solutions Bought
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Purchase ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
