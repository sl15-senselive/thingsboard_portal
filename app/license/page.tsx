"use client";
import { Sidebar } from "@/components/Sidebar";
import React from "react";

const packages = [
  {
    name: "Single License",
    license: "1",
    pricing: 3000 * 1,
  },
  {
    name: "Pack 1",
    license: "5",
    pricing: 2750 * 5,
  },
  {
    name: "Pack 2",
    license: "15",
    pricing: 2500 * 15,
  },
  {
    name: "Pack 3",
    license: "20",
    pricing: 2000 * 20,
  },
];

export default function Page() {
  const [licenseData, setLicenseData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [btnLoading, setBtnLoading] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState(0);
  const [used, setUsed] = React.useState(0);

  React.useEffect(() => {
    fetchLicense();
  }, []);

  function getLicenseValues(licenseData: any) {
    let total = 0;
    let used = 0;

    if (!licenseData) return { total, used };

    for (const license of licenseData) {
      if (license.is_assigned) {
        total += license.total_license;
        used += license.used_license;
      }
    }

    setTotal(total);
    setUsed(used);
    return { total, used };
  }

  function formatDateOnly(timestamp: any) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // ------------- BUY LICENSE ----------------
  async function buyLicense(pkg: any) {
    setBtnLoading(pkg.name);

    try {
      const res = await fetch("/api/license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: "c72e27f0-cc56-11f0-b6cf-df3fde93c9f0",
          package_name: pkg.name,
          total_license: parseInt(pkg.license),
          used_license: 0,
          price: pkg.pricing,
        }),
      });

      const { data } = await res.json();
      console.log("Purchase Response:", data);

      fetchLicense();
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setBtnLoading(null);
    }
  }

  // ------------- FETCH LICENSE DATA ----------------
  async function fetchLicense() {
    setLoading(true);

    try {
      const res = await fetch("/api/license", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { data } = await res.json();
      console.log("License Data:", data);

      setLicenseData(data);
      getLicenseValues(data);
    } catch (error) {
      console.error("Error fetching license data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="w-full p-8">
        <div className="flex justify-between pr-8 items-center mb-8">
          <h1 className="font-bold text-3xl">License</h1>
        </div>

        {/* ---------------- PACKAGE CARDS ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{pkg.name}</h2>
              <p className="text-gray-600 mb-4">{pkg.license} Licenses</p>

              <p className="text-2xl font-bold mb-4">
                ₹{pkg.pricing.toLocaleString()}
              </p>

              <button
                onClick={() => buyLicense(pkg)}
                disabled={btnLoading === pkg.name}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-300"
              >
                {btnLoading === pkg.name ? "Processing..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        {/* ---------------- MAIN LOADING ---------------- */}
        {loading && (
          <div className="w-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
          </div>
        )}
        
        {/* ---------------- NO DATA ---------------- */}
        {!loading && licenseData && licenseData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No licenses purchased yet.</p>
          </div>
        )}

        {/* ---------------- TABLE ---------------- */}
        {!loading && licenseData && licenseData.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8 mt-12 pr-12">
              <h2 className="text-2xl font-bold">Bought Licenses</h2>
              <p className="text-xl px-2 py-1 bg-gray-200 rounded-md font-medium">
                {used}/{total}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Package Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Licenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Purchase Date
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {licenseData.map((license) => (
                    <tr key={license.purchased_time}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {license.package_name}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {!license.is_assigned ? (
                          <span className="text-yellow-600 font-medium">
                            Requested
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                  width: `${
                                    (license.used_license /
                                      license.total_license) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {license.used_license}/{license.total_license}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-6 text-sm">
                        ₹{license.price}
                      </td>

                      <td className="py-3 px-6 text-sm">
                        {formatDateOnly(license.purchased_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
