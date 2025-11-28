import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

interface Plan {
  title: string;
  min: number;
  max: number;
  pricePerMeter: number;
  desc: string;
}

interface InstallationTier {
  name: string;
  maxMeters: number;
  price: number;
  includes: string[];
}

interface DeviceTier {
  name: string;
  desc: string;
  price: number;
  simRequired?: boolean; // NEW
}
interface ScadaSldTier {
  name: string;
  maxDevices: number;
  price: number;
  recommended: boolean;
  features: string[];
}
function EMS_Quotation() {
  const [meterCount, setMeterCount] = useState<number>(1);
  const [gatewayCount, setGatewayCount] = useState<number>(1);
  const [selectedDevice, setSelectedDevice] = useState<DeviceTier | null>(null);
  const [selectedScada, setSelectedScada] = useState<ScadaSldTier | null>(null);

  const SIM_PRICE = 999; // price of one SIM card
  const scadaSldTiers: ScadaSldTier[] = [
    {
      name: "No SCADA",
      maxDevices: 0,
      price: 0,
      recommended: false,
      features: ["No SCADA or SLD features included"],
    },
    {
      name: "Live SCADA Starter",
      maxDevices: 10,
      price: 2200,
      recommended: false,
      features: [
        "Real-time monitoring dashboard",
        "Basic SLD visualization",
        "Standard alarm system",
        "15-minute data logging",
        "Email notifications",
        "PDF reports",
        "Mobile responsive",
      ],
    },
    {
      name: "Live SCADA Professional",
      maxDevices: 25,
      price: 4800,
      recommended: true,
      features: [
        "Advanced HMI interface",
        "Custom SLD layouts",
        "Trend analysis & graphs",
        "Multi-user access control",
        "SMS + Email alerts",
        "Scheduled reports",
        "Mobile app access",
        "API integration ready",
      ],
    },
    {
      name: "Live SCADA Enterprise",
      maxDevices: 50,
      price: 8500,
      recommended: false,
      features: [
        "Full customization suite",
        "3D visualization",
        "Predictive analytics",
        "Advanced user management",
        "Multi-channel alerts",
        "Real-time SLD updates",
        "Cloud synchronization",
        "Priority technical support",
        "Custom integrations",
      ],
    },
  ];

  const scadaPrice = selectedScada?.price || 0;
  const plans: Plan[] = [
    {
      title: "Solo",
      min: 1,
      max: 1,
      pricePerMeter: 2750,
      desc: "Perfect for single critical equipment monitoring",
    },
    {
      title: "Mini",
      min: 2,
      max: 5,
      pricePerMeter: 1100,
      desc: "Ideal for small shops, clinics, or branch offices",
    },
    {
      title: "Shop",
      min: 6,
      max: 10,
      pricePerMeter: 950,
      desc: "Great for medium shops, restaurants, or small factories",
    },
    {
      title: "Plant",
      min: 11,
      max: 25,
      pricePerMeter: 720,
      desc: "Suitable for manufacturing plants or large facilities",
    },
    {
      title: "Campus",
      min: 26,
      max: 50,
      pricePerMeter: 640,
      desc: "Enterprise solution for campuses, hospitals, or large industries",
    },
  ];

  const deviceTiers: DeviceTier[] = [
    { name: "X5050", desc: "RS485 to TCP/IP Ethernet Gateway", price: 4500 },
    {
      name: "X7400D",
      desc: "RS485 to 4G LTE Gateway",
      price: 5500,
      simRequired: true,
    },
    { name: "X7050", desc: "RS485 to WiFi Gateway", price: 3900 },
  ];

  const installationTiers: InstallationTier[] = [
    {
      name: "Basic Setup (upto 5 Gateways)",
      maxMeters: 5,
      price: 5000,
      includes: [
        "Site survey",
        "Basic installation",
        "Configuration",
        "1-day training",
      ],
    },
    {
      name: "Basic Setup",
      maxMeters: 10,
      price: 8000,
      includes: [
        "Site survey",
        "Basic installation",
        "Configuration",
        "1-day training",
      ],
    },
    {
      name: "Standard Setup",
      maxMeters: 20,
      price: 15000,
      includes: [
        "Detailed site survey",
        "Professional installation",
        "Network setup",
        "2-day training",
        "Documentation",
      ],
    },
    {
      name: "Premium Setup",
      maxMeters: 50,
      price: 25000,
      includes: [
        "Complete site analysis",
        "Expert installation",
        "Network optimization",
        "3-day training",
        "Complete documentation",
        "30-day support",
      ],
    },
  ];
  // Plan selection
  const activePlan = plans.find(
    (p) => meterCount >= p.min && meterCount <= p.max
  );
  const meterPriceTotal = activePlan
    ? activePlan.pricePerMeter * meterCount
    : 0;

  // Installation tier
  const activeInstallation = installationTiers.find(
    (tier) => gatewayCount <= tier.maxMeters
  );
  const installationPrice = activeInstallation?.price || 0;

  // Device total
  const devicePriceTotal = selectedDevice
    ? selectedDevice.price * gatewayCount
    : 0;

  // SIM total (only if device requires sim)
  const simTotal = selectedDevice?.simRequired ? gatewayCount * SIM_PRICE : 0;
  const totalPrice =
    meterPriceTotal + devicePriceTotal + scadaPrice + installationPrice;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">EMS Quotation</h1>
        <p className="text-muted-foreground text-lg">
          Instant pricing for Energy Management System
        </p>
      </div>

      <div className="grid lg:grid-cols-[7fr_3fr] gap-10">
        {/* LEFT SECTION */}
        <div>
          {/* Meters */}
          <div className="border rounded-xl overflow-hidden shadow-sm mb-10">
            <div className="bg-gray-100 p-5 border-b">
              <h2 className="text-2xl font-bold">Meters</h2>
            </div>

            <div className="p-6 space-y-8">
              <div className="flex flex-col gap-3 max-w-xs">
                <label className="text-muted-foreground font-medium">
                  Number of Meters Required
                </label>
                <Input
                  type="number"
                  min="1"
                  value={meterCount}
                  onChange={(e) =>
                    setMeterCount(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="text-lg"
                />
              </div>

              {/* Meter Plans */}
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-gray-100 p-3 border-b">
                  <h3 className="font-bold text-lg">Available Plans</h3>
                </div>

                {plans.map((plan) => {
                  const isActive = plan.title === activePlan?.title;
                  return (
                    <div
                      key={plan.title}
                      className={`p-3 border-b ${
                        isActive
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.min}–{plan.max} meters
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {plan.desc}
                          </p>

                          {isActive && (
                            <p className="text-xs text-green-600 font-semibold mt-1">
                              ₹{plan.pricePerMeter} × {meterCount} = ₹
                              {meterPriceTotal.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            ₹{plan.pricePerMeter.toLocaleString("en-IN")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            per meter
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gateway + Device + Installation */}
          <div className="border rounded-xl overflow-hidden shadow-sm mb-10">
            <div className="bg-gray-100 p-5 border-b">
              <h2 className="text-2xl font-bold">Gateways & Installation</h2>
            </div>

            <div className="p-6 space-y-10">
              {/* Parallel Row */}
              <div className="grid grid-cols-2 gap-6 max-w-xl">
                {/* Gateway count */}
                <div className="flex flex-col gap-3">
                  <label className="text-muted-foreground font-medium">
                    Gateways Required
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={gatewayCount}
                    onChange={(e) =>
                      setGatewayCount(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="text-lg"
                  />
                </div>

                {/* Device dropdown */}
                <div className="flex flex-col gap-3">
                  <label className="text-muted-foreground font-medium">
                    Select Gateway Device
                  </label>
                  <select
                    className="border rounded-lg w-full  h-9 px-1 text-sm"
                    onChange={(e) => {
                      const device =
                        deviceTiers.find((d) => d.name === e.target.value) ||
                        null;
                      setSelectedDevice(device);
                    }}
                  >
                    <option value="">Select a device</option>
                    {deviceTiers.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} - ₹{d.price.toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>

                  {/* device description */}
                  {selectedDevice && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedDevice.desc}
                    </p>
                  )}
                </div>
              </div>

              {/* Installation packages */}
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-gray-100 p-3 border-b">
                  <h3 className="font-bold text-lg">Installation Packages</h3>
                </div>

                {installationTiers.map((tier) => {
                  const isActive = tier === activeInstallation;

                  return (
                    <div
                      key={tier.name}
                      className={`p-3 border-b ${
                        isActive
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Up to {tier.maxMeters} meters
                          </p>

                          {isActive && (
                            <p className="text-xs text-green-600 font-semibold mt-1">
                              Installation Cost: ₹
                              {installationPrice.toLocaleString("en-IN")}
                            </p>
                          )}

                          {/* SIM requirement note */}
                          {selectedDevice?.simRequired && isActive && (
                            <p className="text-xs text-blue-700 font-semibold mt-1">
                              Includes {gatewayCount} SIM cards (₹{SIM_PRICE}{" "}
                              each)
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            ₹{tier.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scada */}
          <div className="border rounded-xl overflow-hidden shadow-sm mb-10">
            <div className="bg-gray-100 p-5 border-b">
              <h2 className="text-2xl font-bold">Live SCADA & SLD Solutions</h2>
            </div>
            <div className="p-6 space-y-10">
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-gray-100 p-3 border-b">
                  <h3 className="font-bold text-lg">SCADA / SLD Options</h3>
                </div>

                {scadaSldTiers.map((tier) => {
                  const isActive = tier.name === selectedScada?.name;

                  return (
                    <div
                      key={tier.name}
                      onClick={() => setSelectedScada(tier)}
                      className={`p-4 border-b cursor-pointer ${
                        isActive
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Supports up to {tier.maxDevices} devices
                          </p>

                          {isActive && (
                            <p className="text-xs text-green-600 mt-1">
                              SCADA Price: ₹{tier.price.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>

                        <p className="text-2xl font-bold">
                          ₹{tier.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="h-fit">
          <div className="border-2 rounded-xl shadow-lg p-6 space-y-5">
            <h2 className="text-xl font-bold">Quote Summary</h2>

            <div className="flex justify-between">
              <span>Meters Price</span>
              <span className="font-bold">
                ₹{meterPriceTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Device Price</span>
              <span className="font-bold">
                ₹{devicePriceTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>SCADA Price</span>
              <span className="font-bold">
                ₹{scadaPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Installation Price</span>
              <span className="font-bold">
                ₹{installationPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex flex-col gap-2">
              <Link href={"/register?from=purchase"}>
              <Button
                // onClick={}
                disabled={!selectedDevice || !activePlan}
                className="w-full bg-gradient-primary text-white font-bold text-lg cursor-pointer"
              >
                Pay Now
              </Button>
            </Link>

            <Button variant="outline" className="w-full font-bold text-lg">
              Enquire Now
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EMS_Quotation;
