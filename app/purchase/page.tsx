'use client';

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, CreditCard } from "lucide-react";

const Purchase = () => {
  const router = useRouter();
  const [step, setStep] = useState<"payment" | "company">("payment");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Payment successful!");
      setStep("company");
      setIsProcessing(false);
    }, 1500);
  };

  const handleCompanyRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Company registered successfully! Your devices will be allocated within 24 hours.");
      router.push("/");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === "payment" ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                }`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-medium">Payment</span>
              </div>
              <div className="h-0.5 w-16 bg-border" />
              <div className={`flex items-center gap-2 ${step === "company" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === "company" ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-medium">Company Details</span>
              </div>
            </div>
          </div>

          {step === "payment" ? (
            <Card className="border-2 shadow-large">
              <CardHeader>
                <CardTitle className="text-2xl">Payment Information</CardTitle>
                <CardDescription className="text-base">
                  Complete your purchase to proceed with company registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" maxLength={3} required />
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg flex justify-between items-center">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">₹24,999</span>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Complete Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 shadow-large">
              <CardHeader>
                <CardTitle className="text-2xl">Company Registration</CardTitle>
                <CardDescription className="text-base">
                  Provide your company details to set up your IoT solution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanyRegistration} className="space-y-6">
                  {/* Company Form Fields (same as before) */}
                  {/* -- keep your full company fields here -- */}
                  <Button type="submit"  className="w-full bg-gradient-primary" disabled={isProcessing}>
                    {isProcessing ? "Registering..." : "Complete Registration"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchase;
