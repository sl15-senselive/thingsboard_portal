"use client";
import { Sidebar} from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cpu,
  Cloud,
  BarChart3,
  Shield,
  Zap,
  Headphones,
  ArrowRight,
  Check,
} from "lucide-react";
import heroImage from "@/assets/hero-iot.jpg";
import deviceImage from "@/assets/device-sensor.jpg";
import Image from "next/image";

const LandingPage = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Smart Sensors",
      description:
        "Advanced IoT sensors with real-time data collection and monitoring capabilities",
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Platform",
      description:
        "Secure cloud infrastructure powered by ThingsBoard for seamless data management",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Data Analytics",
      description:
        "Powerful analytics tools to derive actionable insights from your IoT data",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption and security protocols to protect your data",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description:
        "Monitor your devices and receive instant alerts for critical events",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description:
        "Dedicated support team ready to assist you anytime, anywhere",
    },
  ];

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
      id: "busbar-temperature-monitoring-system",
      name: "Busbar Temperature Monitoring System",
      description:
        "The SenseLive Wireless Busbar Temperature Monitoring System is an advanced Industrial IoT solution designed for real-time electrical panel temperature sensing and busbar overheating detection.",
      image: "/solutions/busbar-temperature-monitoring-system/updateimage.jpeg",
      badge: "Electrical Monitoring",
      price: 42999,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero mx-auto max-w-6xl">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="container  px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Transform Your Business with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Smart IoT Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Automate device management, monitor in real-time, and unlock
              powerful insights with Senselive's enterprise-grade IoT platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-gradient-primary">
                <Link href="/auth">
                  Get Started <ArrowRight className="ml-2 animate-[bounceX_1s_infinite]" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src={"/IIOT.png"}
              alt="IoT Dashboard"
              className="rounded-2xl shadow-large w-full"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Senselive?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade IoT solutions designed to scale with your business
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive IoT solutions tailored to your industry needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="border-2 hover:shadow-large transition-all duration-300"
            >
              <Image
                src={solution.image}
                alt={solution.name}
                width={1000}
                height={1000}
              />
              <CardHeader>
                <CardTitle className="text-2xl">{solution.name}</CardTitle>
                <CardDescription className="text-base">
                  {solution.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full bg-gradient-primary" asChild>
                  <Link href="/">Get Quotation</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/contact">Enquire Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center items-center">
            <Button size="lg" variant="secondary" className="mt-5 mx-auto" asChild>
          <Link href="/solutions" className="flex justify-center items-center">
            See More Solutions <ArrowRight className="ml-2 animate-[bounceX_1s_infinite]" />
          </Link>
        </Button>
        </div>
        
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-large">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join hundreds of businesses already using Senselive to transform
              their operations
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth">
                Start Your Free Trial <ArrowRight className="ml-2 animate-[bounceX_1s_infinite]" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Senselive.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
