"use client";
import React, { useEffect } from "react";
import {
  DollarSign,
  FileText,
  CreditCard,
  ShoppingCart,
  Package,
  IndianRupee,
  Cpu,
  EyeOff,
  Eye,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "sonner";

const CustomerDashboard = () => {
  useEffect(() => {
    fetchDevices();
  }, []);

  function toLocalIST(timestamp: string) {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) return "Invalid timestamp";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  const [showModal, setShowModal] = React.useState(false);
  const [ordersData, setOrdersData] = React.useState<any[] | null>(null);
  const [selectedCreds, setSelectedCreds] = React.useState<any>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const [newDevice, setNewDevice] = React.useState({
    name: "",
    username: "",
    password: "",
  });

  function openCreds(order: any) {
    const creds = JSON.parse(order.creds);

    setSelectedCreds({
      id: order.id,
      userName: creds.userName,
      password: creds.password,
    });
    console.log(order.id);
    
    setShowPassword(false);
    setShowModal(true);
  }

  async function updateCreds() {
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCreds.id,
          username: selectedCreds.userName,
          password: selectedCreds.password,
        }),
      });

      if (!res.ok) {
        toast.error(res.statusText || "Failed to update credentials");
        return;
      }

      toast.success("Credentials updated successfully!");

      setShowModal(false);
      fetchDevices(); // refresh table
    } catch (error) {
      console.error(error);
      toast.error("Error updating credentials");
    }
  }

  async function fetchDevices() {
    try {
      const res = await fetch("/api/device", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        alert("Failed to fetch devices");
        return;
      }

      const { devices } = await res.json();

      // Sort by created_at DESC
      const sortedDevices = devices.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrdersData(sortedDevices);
      console.log("Devices:", sortedDevices);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveDevice() {
    try {
      const res = await fetch("/api/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDevice.name,
          username: newDevice.username,
          password: newDevice.password,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to add device");
        return;
      }

      toast.success("Device added successfully!");
      setShowAddModal(false);

      // reset form
      setNewDevice({ name: "", username: "", password: "" });
    } catch (error) {
      toast.error("Error adding device");
      console.error(error);
    }
  }

  // const handle

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div>
        <Sidebar />
      </div>
      <div className="w-full p-8 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {/* Total Purchases */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Purchases
              </h3>
              <div className="p-2 bg-blue-50 rounded">
                {/* <DollarSign className="w-5 h-5 text-blue-600" /> */}
                <IndianRupee className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold  mb-1">₹2,500.00</div>
            <p className="text-xs text-gray-500">
              Across all solutions & products
            </p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Orders
              </h3>
              <div className="p-2 bg-orange-50 rounded">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {ordersData
                ? ordersData.filter((order) => !order.is_assigned).length
                : "..."}
            </div>
            <p className="text-xs text-gray-500">
              Awaiting payment or delivery
            </p>
          </div>

          {/* Available Credits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Devices
              </h3>
              <div className="p-2 bg-green-50 rounded">
                {/* <CreditCard className="w-5 h-5 text-green-600" /> */}
                <Cpu className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {ordersData?.length || "..."}
            </div>
            <p className="text-xs text-gray-500">
              Across all solutions & products
            </p>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Customers Details
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-300"
            >
              Add Device
            </button>
          </div>

          <div className="overflow-x-auto">
            {!ordersData && (
              <div className="p-4 text-center text-gray-500">
                Loading devices...
              </div>
            )}
            {ordersData && ordersData.length === 0 && (
              <div>
                <div className="p-4 text-center text-gray-500">
                  No devices found.
                </div>
              </div>
            )}
            {ordersData && ordersData.length > 0 && (
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
                      Device Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Credentials
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {ordersData &&
                    ordersData.map((order) => (
                      <tr
                        key={order.created_at}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-2 text-sm font-medium text-gray-900">
                          {toLocalIST(order.created_at)}
                        </td>
                        <td className="px-6 py-2 text-sm text-gray-700">
                          {order.device_name}
                        </td>
                        <td className="px-6 py-2 text-sm text-gray-700">
                          {order.type}
                        </td>
                        <td className="px-6 py-2 text-sm text-blue-600">
                          <button
                            onClick={() => openCreds(order.credentials)}
                            className="underline hover:text-blue-800"
                          >
                            View Credentials
                          </button>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full
      ${
        !order.is_assigned
          ? "bg-yellow-100 text-yellow-700" // Pending
          : order.is_active
          ? "bg-green-100 text-green-700" // Active
          : "bg-red-100 text-red-700" // Inactive
      }
    `}
                          >
                            {!order.is_assigned
                              ? "Pending"
                              : order.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
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
                <input
                  className="mt-1 w-full p-2 border rounded-lg bg-gray-50 text-gray-800"
                  value={selectedCreds.userName}
                  onChange={(e) =>
                    setSelectedCreds({
                      ...selectedCreds,
                      userName: e.target.value,
                    })
                  }
                />
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
                    className="bg-transparent w-full outline-none"
                    onChange={(e) =>
                      setSelectedCreds({
                        ...selectedCreds,
                        password: e.target.value,
                      })
                    }
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
              <div className="flex gap-3">
                <button
                  className="mt-3 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
                  onClick={() => updateCreds()}
                >
                  Save
                </button>
                <button
                  className="mt-3 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add Device Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Add New Device</h2>

              {/* Device Name */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600">
                  Device Name
                </label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, name: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded-lg bg-gray-50 outline-none"
                  placeholder="Enter device name"
                />
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  value={newDevice.username}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, username: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded-lg bg-gray-50 outline-none"
                  placeholder="Enter username"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  value={newDevice.password}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, password: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded-lg bg-gray-50 outline-none"
                  placeholder="Enter password"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveDevice}
                className="mt-3 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
              >
                Save Device
              </button>

              {/* Cancel */}
              <button
                className="mt-2 w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
