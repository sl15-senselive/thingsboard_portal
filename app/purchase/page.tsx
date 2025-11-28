'use client';

import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, ArrowLeft } from "lucide-react";
import Image from "next/image";

const Purchase = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const solutionId = searchParams?.get('solution');
  
  const solutions = [
    {
      id: "ems",
      name: "Energy Management System",
      description:
        "Comprehensive energy monitoring and management solution that helps businesses reduce energy consumption, optimize operations, and meet sustainability goals.",
      image: "/solutions/ems/ems1.1.png",
      badge: "Energy Management",
      price: 49999,
      features: [
        "Real-time energy monitoring",
        "Automated reporting & analytics",
        "Cost optimization insights",
        "Carbon footprint tracking",
        "24/7 technical support"
      ]
    },
    {
      id: "water-management",
      name: "Water Management System",
      description:
        "Intelligent water monitoring and management solution that helps organizations optimize water usage, detect leaks, and ensure water quality.",
      image: "/solutions/wms/wms1.png",
      badge: "Water Management",
      price: 45999,
      features: [
        "Smart leak detection",
        "Water quality monitoring",
        "Usage analytics & insights",
        "Automated alerts",
        "24/7 technical support"
      ]
    },
    {
      id: "digital-checksheet",
      name: "Digital Checksheet",
      description:
        "Paperless inspection and quality control solution that streamlines processes, ensures compliance, and improves operational efficiency.",
      image: "/solutions/checklist/checklist1.png",
      badge: "Digital Transformation",
      price: 39999,
      features: [
        "Customizable checklists",
        "Digital signatures",
        "Compliance tracking",
        "Mobile app access",
        "24/7 technical support"
      ]
    },
    {
      id: "production-monitoring",
      name: "Production Monitoring",
      description:
        "End-to-end production monitoring solution that provides real-time visibility, improves efficiency, and optimizes manufacturing processes.",
      image: "/solutions/production/production1.png",
      badge: "Manufacturing Excellence",
      price: 54999,
      features: [
        "Real-time production tracking",
        "OEE monitoring",
        "Downtime analysis",
        "Quality metrics",
        "24/7 technical support"
      ]
    },
    {
      id: "busbar-temperature-monitoring-system",
      name: "Busbar Temperature Monitoring System",
      description:
        "The SenseLive Wireless Busbar Temperature Monitoring System is an advanced Industrial IoT solution designed for real-time electrical panel temperature sensing and busbar overheating detection.",
      image: "/solutions/busbar-temperature-monitoring-system/updateimage.jpeg",
      badge: "Electrical Monitoring",
      price: 42999,
      features: [
        "Wireless temperature sensing",
        "Overheating alerts",
        "Predictive maintenance",
        "Historical data analysis",
        "24/7 technical support"
      ]
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
      features: [
        "Health monitoring",
        "Failure prevention",
        "Lifespan optimization",
        "Performance analytics",
        "24/7 technical support"
      ]
    },
  ];

  const [selectedSolution, setSelectedSolution] = useState<typeof solutions[0] | null>(null);

  useEffect(() => {
    if (solutionId) {
      const solution = solutions.find(s => s.id === solutionId);
      if (solution) {
        setSelectedSolution(solution);
      } else {
        toast.error("Solution not found");
        router.push("/solutions");
      }
    } else {
      toast.error("No solution selected");
      router.push("/solutions");
    }
  }, [solutionId]);

  const handlePurchase = () => {
    // For now, navigate to /register
    // Later, this will redirect to Razorpay
    router.push("/register");
  };

  if (!selectedSolution) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      <Sidebar />
      
      {/* Main Content Area - positioned to avoid sidebar overlap */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/solutions")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Solutions
          </Button>

          {/* Main Layout: Price Card LEFT, Solution RIGHT */}
          <div className="grid lg:grid-cols-[760px_1fr] gap-8 items-start">
            <Card className="border-2 shadow-large overflow-hidden">
              {/* Image on Top */}
              <div className="relative h-96 w-full">
                <Image
                  src={selectedSolution.image}
                  alt={selectedSolution.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Description Below Image */}
              <div className="p-8 space-y-4">
                <Badge className="bg-accent text-accent-foreground">
                  {selectedSolution.badge}
                </Badge>

                <h1 className="text-4xl font-bold">
                  {selectedSolution.name}
                </h1>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {selectedSolution.description}
                </p>

                {/* Additional Info */}
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-xl mb-4">Why Choose This Solution?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Installation Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Professional installation included with purchase
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">1-Year Warranty</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete coverage for parts and service
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Training Included</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive training for your team
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">24/7 Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Round-the-clock technical assistance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            {/* LEFT SIDE - Price Card */}
            <Card className="border-2 shadow-large lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Display */}
                <div className="text-center p-6 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">
                      ₹{selectedSolution.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+ GST</p>
                </div>

                {/* Features List */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">What's Included:</h3>
                  <ul className="space-y-2">
                    {selectedSolution.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-primary text-lg py-6"
                  size="lg"
                >
                  Proceed to Buy
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Price includes installation and 1-year warranty
                </p>
              </CardContent>
            </Card>

            {/* RIGHT SIDE - Solution Details */}
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;