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
    fetchLicense();
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

  const [showModal, setShowModal] = React.useState(false);
  const [ordersData, setOrdersData] = React.useState<any[] | null>(null);
  const [selectedCreds, setSelectedCreds] = React.useState<any>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [remainingLicense, setRemainingLicense] = React.useState<number | null>(
    null
  );
  const [totalLicense, setTotalLicense] = React.useState<number>(0);
  const [usedLicense, setUsedLicense] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);

  const [newDevice, setNewDevice] = React.useState({
    name: "",
    username: "",
    password: "",
  });

  function openCreds(order: any) {
    let creds = JSON.parse(order.credentials.credentialsValue);
    setSelectedCreds({
      id: order.id.id,
      userName: creds.userName ?? creds.username ?? "",
      password: creds.password ?? "",
    });

    setShowPassword(false);
    setShowModal(true);
  }

  async function updateCreds() {
    try {
      const res = await fetch("/api/admin/device/credentials", {
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
      fetchDevices();
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

  // Calculate licenses in frontend based on is_assigned = true
  function calculateLicenses(licenseData: any[]) {
    // Filter only assigned licenses
    const assignedLicenses = licenseData.filter(
      (license) => license.is_assigned === true
    );

    // Calculate total licenses from assigned ones
    const total = assignedLicenses.reduce(
      (acc: number, curr: any) => acc + (curr.total_license || 0),
      0
    );

    // Calculate used licenses from assigned ones
    const used = assignedLicenses.reduce(
      (acc: number, curr: any) => acc + (curr.used_license || 0),
      0
    );

    // Calculate remaining
    const remaining = total - used;

    setTotalLicense(total);
    setUsedLicense(used);
    setRemainingLicense(remaining);

    // Also calculate total price from all licenses (assigned or not)
    getTotalPrice(licenseData);
  }

  async function fetchLicense() {
    try {
      const res = await fetch("/api/license", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.warn("Failed to fetch license");
        setRemainingLicense(null);
        setTotalLicense(0);
        setUsedLicense(0);
        return;
      }
      const { data } = await res.json();
      
      // Calculate licenses in frontend
      calculateLicenses(data);
    } catch (e) {
      console.error("Error fetching license", e);
      setRemainingLicense(null);
      setTotalLicense(0);
      setUsedLicense(0);
    }
  }

  async function saveDevice() {
    // Validation
    if (!newDevice.name.trim()) {
      toast.error("Device name is required");
      return;
    }
    if (!newDevice.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!newDevice.password.trim()) {
      toast.error("Password is required");
      return;
    }

    // Check license availability before making API call
    if (remainingLicense === null) {
      toast.error("Unable to verify license availability");
      return;
    }

    if (remainingLicense <= 0) {
      toast.error("No licenses available. Please purchase more licenses.");
      return;
    }

    setIsSaving(true);

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

      const responseData = await res.json();

      if (!res.ok) {
        toast.error(responseData.message || "Failed to add device");
        return;
      }

      toast.success("Device added successfully!");
      setShowAddModal(false);
      
      // Reset form
      setNewDevice({ name: "", username: "", password: "" });
      
      // Refresh data
      await Promise.all([fetchDevices(), fetchLicense()]);
      
    } catch (error) {
      toast.error("Error adding device");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  function getTotalPrice(devices: any[]) {
    let total = 0;
    for (const device of devices) {
      total += device.price;
    }
    setTotalPrice(total);
  }

  function handleAddDeviceClick() {
    // Fetch latest license info before opening modal
    fetchLicense();
    setShowAddModal(true);
  }

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
                <IndianRupee className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold  mb-1">₹{totalPrice}</div>
            <p className="text-xs text-gray-500">
              Across all solutions & products
            </p>
          </div>

          {/* Available License */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Available License
              </h3>
              <div className="p-2 bg-orange-50 rounded">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {remainingLicense !== null ? remainingLicense : "..."}
            </div>
            <p className="text-xs text-gray-500">
              {totalLicense > 0 && `${usedLicense} used of ${totalLicense} total`}
            </p>
          </div>

          {/* Total Devices */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Devices
              </h3>
              <div className="p-2 bg-green-50 rounded">
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
              onClick={handleAddDeviceClick}
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
                        key={order.id.id ?? order.createdTime}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-2 text-sm font-medium text-gray-900">
                          {toLocalISTDate(order.createdTime)}
                        </td>
                        <td className="px-6 py-2 text-sm text-gray-700">
                          {order.name}
                        </td>
                        <td className="px-6 py-2 text-sm text-gray-700">
                          {order.type}
                        </td>
                        <td className="px-6 py-2 text-sm text-blue-600">
                          <button
                            onClick={() => openCreds(order)}
                            className="underline hover:text-blue-800"
                          >
                            View Credentials
                          </button>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full
      ${
        order.is_active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }
    `}
                          >
                            {order.is_active ? "Active" : "Inactive"}
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
        {showAddModal &&
          (remainingLicense === null ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Loading...</h2>
                <p className="text-sm text-gray-500">
                  Checking license availability.
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    className="mt-3 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
                    onClick={() => setShowAddModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : remainingLicense > 0 ? (
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
                  disabled={isSaving}
                  className="mt-3 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Device"}
                </button>

                {/* Cancel */}
                <button
                  className="mt-2 w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  License Limit Reached
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                  You have reached your device license limit. Please purchase more licenses to add additional devices.
                </p>

                {/* Close Button */}
                <div className="flex gap-3">
                  <button
                    className="mt-3 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
                    onClick={() => setShowAddModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;