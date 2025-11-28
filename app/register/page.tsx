'use client';
import CompanyRegistrationForm from "@/components/CompanyRegister";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center">
      <div>
        <Sidebar />
      </div>
      <div className="w-full p-8 ">
        <Button
            variant="ghost"
            onClick={() => router.push("/solutions")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Solutions
          </Button>
        <h1 className="text-center text-3xl mb-4 font-semibold">Register Your Company</h1>
        <div>
            {/* Registration form will go here */}
            <CompanyRegistrationForm/>
        </div>
      </div>
    </div>
  );
};

export default page;
