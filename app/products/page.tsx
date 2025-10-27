"use client";

import Image from "next/image";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";

const Products = () => {
  const [cart, setCart] = React.useState<string[]>([]);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const categories = [
    { id: "all", label: "All Products" },
    { id: "gateways", label: "Modbus Gateways" },
    { id: "controllers", label: "Remote IO Controllers" },
    { id: "connectivity", label: "4G/5G Products" },
    { id: "wireless", label: "LoRa/ZigBee Devices" },
    { id: "wifi", label: "WiFi Solutions" },
    { id: "fiber", label: "Optical Fiber" },
    { id: "wireless-bus-bar", label: "Wireless Bus Bar Solutions" },
    { id: "switch", label: "Switch" },
  ];

  const allProducts = [
    // Wireless Bus Bar Solutions
    {
      id: "edge8000",
      name: "SenseLive Edge8000",
      description: "Wireless Bus Bar / Surface Temperature Monitoring System",
      specs: [
        "Up to 60 wireless sensors",
        "Integrated Energy Meter",
        "RS485 Data Output",
        "Built-In Dual Relays",
      ],
      image: "/products/wireless-bus-bar/edge8000/front.png",
      category: "wireless-bus-bar",
      price: 899,
    },
    {
      id: "sensebt-222",
      name: "SenseLive SenseBT-222",
      description: "Battery-Powered Wireless Temperature Sensor",
      specs: [
        "Long Battery Life",
        "Wide Range",
        "Industrial Design",
        "Wireless Communication",
      ],
      image: "/products/wireless-bus-bar/SenseBT222/SenseBT222img1.png",
      category: "wireless-bus-bar",
      price: 149,
    },
    {
      id: "sensect-222",
      name: "SenseLive SenseCT-222",
      description: "CT-Powered Wireless Temperature Sensor",
      specs: [
        "Self-Powered",
        "Real-time Monitoring",
        "Easy Installation",
        "Maintenance-Free",
      ],
      image: "/products/wireless-bus-bar/SenseCT222/SenseCT222img1.png",
      category: "wireless-bus-bar",
      price: 179,
    },

    // Controllers
    {
      id: "e7000",
      name: "SenseLive E7000",
      description: "Ethernet-based Remote IO Controller",
      specs: [
        "4 Digital Inputs",
        "2 Analog Inputs",
        "4 Relay Outputs",
        "Modbus TCP Support",
      ],
      image: "/products/controllers/e7000/thumbnail.png",
      category: "controllers",
      price: 320,
    },
    {
      id: "e7500",
      name: "SenseLive E7500",
      description: "RS485-based Remote IO Controller",
      specs: [
        "4 Digital Inputs",
        "2 Analog Inputs",
        "4 Relay Outputs",
        "Modbus RTU Support",
      ],
      image: "/products/controllers/e7500/thumbnail.png",
      category: "controllers",
      price: 299,
    },
    {
      id: "e6888",
      name: "SenseLive E6888",
      description: "8 Channels DI/DO/AI Remote IO Controller",
      specs: [
        "8 Digital Inputs",
        "8 Analog Inputs",
        "8 Digital Outputs",
        "Protocol Support",
      ],
      image: "/products/controllers/e6888/e6888.png",
      category: "controllers",
      price: 449,
    },
    {
      id: "s485h",
      name: "SenseLive S485H",
      description: "8 channel S485H - RS485 HUB Remote IO Controller",
      specs: [
        "8 RS485 Slave Ports with 1 Master Port",
        "Opto-Isolated for High Reliability",
        "Supports High Baud Rate up to 460800bps",
        "Power Supply: DC 9–24V",
        "MODBUS RTU/TCP Protocol Support",
        "Easy DIN Rail or Panel Mounting",
      ],
      image: "/products/controllers/s485h/s485h.png",
      category: "controllers",
      price: 399,
    },

    // Connectivity
    {
      id: "x9000",
      name: "SenseLive X9000",
      description: "4G IoT Gateway with Edge Intelligence",
      specs: [
        "4G CAT1 Connectivity",
        "Digital & Analog Inputs",
        "Dual RS485 Ports",
        "Edge Computing",
      ],
      image: "/products/connectivity/x9000/thumbnail.png",
      category: "connectivity",
      price: 599,
    },
    {
      id: "x7400d",
      name: "SenseLive X7400D",
      description: "DIN-rail 4G CAT1 DTU with RS485 Interface",
      specs: [
        "4G CAT1 with 2G Fallback",
        "RS485 Interface",
        "MQTT & JSON Support",
        "Edge Computing Features",
      ],
      image: "/products/wireless/X7700D/X7700Dimg1.png",
      category: "connectivity",
      price: 429,
    },
    {
      id: "x7400",
      name: "SenseLive X7400",
      description: "Compact 4G Router",
      specs: ["LTE Cat 4", "WiFi Hotspot", "Compact Design", "Easy Setup"],
      image: "/products/connectivity/x7400/x7400img1.png",
      category: "connectivity",
      price: 379,
    },
    {
      id: "x7400e",
      name: "X7400E",
      description: "2G/3G/4G Serial Device Server",
      specs: [
        "2G/3G/4G multi-network support",
        "TCP/UDP Server & Client modes",
        "Flexible serial port 1200–460800 bps",
        "Easy setup via AT, Web, SLVircom",
      ],
      image: "/products/connectivity/7400E/x7400e.png",
      category: "connectivity",
      price: 349,
    },

    // Gateways
    {
      id: "x5050",
      name: "SenseLive X5050",
      description: "RS485 to TCP/IP Modbus Server",
      specs: [
        "Modbus TCP ↔ RTU",
        "MQTT Gateway",
        "DIN-Rail Mount",
        "-40°C to +85°C",
      ],
      image: "/products/gateway/x5050/X5050.png",
      category: "gateways",
      price: 299,
    },
    {
      id: "x6000",
      name: "SenseLive X6000",
      description: "2 Port Isolated Device Server Modbus RTU to Modbus TCP",
      specs: [
        "2-Port Isolated Device Server",
        "Multi-host Modbus RTU ↔ Modbus TCP Converter",
        "MQTT Protocol Support",
        "DIN-Rail Mounting",
      ],
      image: "/products/gateway/x6000/x6000.png",
      category: "gateways",
      price: 369,
    },
    {
      id: "x6600",
      name: "SenseLive X6600",
      description: "RS232/485/422 to TCP/IP converter Modbus Gateway",
      specs: [
        "DIN-Rail or Multi-mount",
        "Compact & Rugged (88×62×33 mm)",
        "Wide Operating Range: -40°C to +85°C, 95% RH",
        "Flexible Power: 9–24V DC",
        "Multi-mode: TCP Server/Client, UDP, Multicast",
        "Easy Configuration: VirCOM, Web, AT commands",
      ],
      image: "/products/gateway/x6600/x6600.png",
      category: "gateways",
      price: 389,
    },
    {
      id: "x5600",
      name: "SenseLive X5600",
      description: "RS232/485/422 To TCP/IP Converter",
      specs: [
        "Dual RS485 Ports",
        "Modbus TCP ↔ RTU",
        "MQTT & JSON Gateway",
        "10/100M Ethernet with 2KV surge protection",
      ],
      image: "/products/gateway/x5600/x5600.png",
      category: "gateways",
      price: 359,
    },
    {
      id: "x5200",
      name: "SenseLive X5200",
      description: "RS485 to TCP/IP ModbusTCP",
      specs: [
        "Wide Operating Range: -40°C to +85°C, 95% RH",
        "Flexible Power: 9–24V DC",
        "Multi-mode: TCP Server/Client, UDP, Multicast",
      ],
      image: "/products/gateway/x5200/x5200.png",
      category: "gateways",
      price: 319,
    },
    {
      id: "x8300",
      name: "SenseLive X8300",
      description: "PLC Modbus gateways",
      specs: [
        "Easy Configuration: VirCOM, Web, AT commands",
        "Supports multiple hosts and storage modes",
        "WiFi/Ethernet/4G connectivity",
      ],
      image: "/products/gateway/x8300/x8300.png",
      category: "gateways",
      price: 499,
    },
    {
      id: "x9900",
      name: "SenseLive X9900",
      description: "Modbus gateways",
      specs: [
        "Protocol: Profinet–Modbus conversion",
        "Network: Dual 10/100M Ethernet",
        "Serial: 4× RS485 (300–921600 baud)",
        "Modes: Modbus Master/Slave, Profinet Slave, Modbus TCP Slave",
      ],
      image: "/products/gateway/x9900/x9900.png",
      category: "gateways",
      price: 599,
    },

    // Wireless
    {
      id: "x7700d",
      name: "SenseLive X7700D",
      description: "DIN-Rail LoRa Device",
      specs: [
        "DIN-Rail Mounting",
        "RS485 & Modbus RTU support",
        "Long-Range LoRa Transmission",
        "Secure & Encrypted Communication",
      ],
      image: "/products/wireless/X7700D/X7700Dimg1.png",
      category: "wireless",
      price: 279,
    },
    {
      id: "x7800",
      name: "SenseLive X7800",
      description: "Wall-Mounted LoRa Device with RS232 Features",
      specs: [
        "Wall-Mounted & Compact Design",
        "Dual RS232 & RS485 Support",
        "LoRaWAN & Private LoRa Protocol",
        "Low Power Consumption",
      ],
      image: "/products/wireless/senseliveX7800/main.png",
      category: "wireless",
      price: 329,
    },
    {
      id: "x7900",
      name: "SenseLive X7900",
      description: "LoRa Gateway with TCP Output",
      specs: [
        "LoRaWAN & Private LoRa Protocols",
        "TCP/IP Gateway Functionality",
        "Multiple Network Interfaces",
        "Web-Based Management Console",
      ],
      image: "/products/wireless/x7900/thumbnail.png",
      category: "wireless",
      price: 459,
    },

    // WiFi
    {
      id: "x7050",
      name: "SenseLive X7050",
      description:
        "Wi-Fi Serial Server – RS-485 to 802.11b/g/n with Modbus RTU↔TCP",
      specs: [
        "Dual Band",
        "IP65 Rated",
        "Enterprise Security",
        "High Data Throughput",
      ],
      image: "/products/wifi/x7050/X7050.png",
      category: "wifi",
      price: 289,
    },

    // Fiber
    {
      id: "x8555",
      name: "SenseLive X8555",
      description: "RS232/485/422 to optical fiber",
      specs: [
        "Single-mode",
        "Single Fiber",
        "Industrial Grade",
        "Wide Temperature Range",
      ],
      image: "/products/fiber/X8555/x8555img1.png",
      category: "fiber",
      price: 319,
    },
    {
      id: "x8550",
      name: "SenseLive X8550",
      description: "Optical Transceiver Industrial Fiber",
      specs: [
        "Industrial-Grade Optical Transceiver",
        "Reliable Single-Mode Fiber Transceiver",
        "Rugged Optical Fiber Converter",
        "High-Reliability Industrial Fiber Link",
      ],
      image: "/products/fiber/X8550/x8550-front.png",
      category: "fiber",
      price: 289,
    },

    // Switch
    {
      id: "s4050",
      name: "SenseLive S4050",
      description: "Industrial grade switch",
      specs: [
        "5-port 10/100M adaptive Ethernet switch",
        "Compact rail-mounted design for easy installation",
        "Wide 9–24V DC power input with terminal connection",
        "Plug-and-play, no configuration required",
      ],
      image: "/products/switch/s4050/s4050.png",
      category: "switch",
      price: 149,
    },
  ];

  const handleAddToCart = (productId: string) => {
    setCart((prev) => [...prev, productId]);
    toast("Added to Cart", {
      description: "Product has been added to your cart successfully.",
    });
  };

  const handleBuyNow = (product: (typeof allProducts)[0]) => {
    toast("Proceeding to Checkout", {
      description: `Purchasing ${
        product.name
      } - ₹${product.price.toLocaleString()}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              IoT Products
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry-leading IoT devices and sensors for every use case
          </p>
          {cart.length > 0 && (
            <Badge className="mt-4 bg-accent text-accent-foreground">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {cart.length} items in cart
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200
        ${
          activeCategory === cat.id
            ? "bg-gradient-primary text-white border-gradient-primary"
            : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
        }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allProducts
            .filter(
              (p) => activeCategory === "all" || p.category === activeCategory
            )
            .map((product) => (
              <Card
                key={product.id}
                className="border-2 hover:shadow-large transition-all duration-300 flex flex-col"
              >
                <CardHeader>
                  <Badge className="w-fit bg-accent text-accent-foreground mb-3">
                    {product.category}
                  </Badge>
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      height={1000}
                      width={1000}
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Features</h4>
                    <ul className="space-y-1">{product.description}</ul>
                  </div>

                  {/* <div>
                  <h4 className="font-semibold text-sm mb-2">Specifications</h4>
                  <dl className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Connectivity</dt>
                      <dd className="font-medium">
                        {product.specifications.connectivity}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Protocol</dt>
                      <dd className="font-medium">
                        {product.specifications.protocol}
                      </dd>
                    </div>
                    {product.specifications.accuracy && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Accuracy</dt>
                        <dd className="font-medium">
                          {product.specifications.accuracy}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div> */}
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-gradient-primary"
                    onClick={() => handleBuyNow(product)}
                  >
                    <Zap className="mr-2" />
                    Buy Now
                  </Button>
                  <Button
                    className="w-full bg-gradient-primary bg-clip-text text-transparent"
                    variant="outline"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
