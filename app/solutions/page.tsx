'use client';

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const Solutions = () => {
  const solutions = [
    {
      id: "ems",
      name: "Energy Management System",
      description:
        "Comprehensive energy monitoring and management solution that helps businesses reduce energy consumption, optimize operations, and meet sustainability goals.",
      image: "/solutions/ems/ems1.1.png",
      badge: "Energy Management",
      price: 49999,
    },
    {
      id: "water-management",
      name: "Water Management System",
      description:
        "Intelligent water monitoring and management solution that helps organizations optimize water usage, detect leaks, and ensure water quality.",
      image: "/solutions/wms/wms1.png",
      badge: "Water Management",
      price: 45999,
    },
    {
      id: "digital-checksheet",
      name: "Digital Checksheet",
      description:
        "Paperless inspection and quality control solution that streamlines processes, ensures compliance, and improves operational efficiency.",
      image: "/solutions/checklist/checklist1.png",
      badge: "Digital Transformation",
      price: 39999,
    },
    {
      id: "production-monitoring",
      name: "Production Monitoring",
      description:
        "End-to-end production monitoring solution that provides real-time visibility, improves efficiency, and optimizes manufacturing processes.",
      image: "/solutions/production/production1.png",
      badge: "Manufacturing Excellence",
      price: 54999,
    },
    {
      id: "busbar-temperature-monitoring-system",
      name: "Busbar Temperature Monitoring System",
      description:
        "The SenseLive Wireless Busbar Temperature Monitoring System is an advanced Industrial IoT solution designed for real-time electrical panel temperature sensing and busbar overheating detection.",
      image: "/solutions/busbar-temperature-monitoring-system/updateimage.jpeg",
      badge: "Electrical Monitoring",
      price: 42999,
    },
    {
      id: "transformer-monitoring-system",
      name: "Transformer Monitoring System",
      description:
        "The SenseLive Transformer Monitoring System uses sensors, communication modules, and software to track transformer health, prevent failures, extend lifespan, and optimize performance.",
      image:
        "/solutions/transformer-monitoring-system/transformer-monitoring-dashbaord.png",
      badge: "Manufacturing Excellence",
      price: 46999,
    },
  ];

  const handleGetQuotation = (solution: (typeof solutions)[0]) => {
    toast("Quotation Generated", {
      description: `Quotation for ${solution.name}: ₹${solution.price.toLocaleString()}`,
    });
  };

  const handleEnquire = (solution: (typeof solutions)[0]) => {
    toast("Enquiry Submitted", {
      description: `Our team will contact you about ${solution.name}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Explore Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              IoT Solutions
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover powerful, ready-to-deploy IoT systems for monitoring,
            automation, and operational excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {solutions.map((solution) => (
            <Card
              key={solution.id}
              className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full h-56">
                <Image
                  src={solution.image}
                  alt={solution.name}
                  height={1000}
                  width={1000}
                  className="object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <Badge className="bg-accent text-accent-foreground">
                  {solution.badge}
                </Badge>

                <h2 className="text-2xl font-bold">{solution.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {solution.description}
                </p>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{solution.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={() => handleGetQuotation(solution)}
                    className="w-full bg-gradient-primary"
                  >
                    <FileText className="mr-2" />
                    Get Quotation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEnquire(solution)}
                  >
                    <MessageSquare className="mr-2" />
                    Enquire Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Solutions;
