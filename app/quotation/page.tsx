// app/solution/page.tsx  (or wherever your file is in app/)

"use client";

import { Sidebar } from "@/components/Sidebar";
import EMS_Quotation from "@/components/EMS_Quotation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import WMS_Quotation from "@/components/WMS_Quotation";

// Separate component that uses useSearchParams (needs Suspense)
function SolutionContent() {
  const searchParams = useSearchParams();
  const solutionId = searchParams.get("solution");
//   console.log(typeof(solutionId));

  return (
    <div className="w-full p-8">
      {solutionId === "ems" ? (
        <EMS_Quotation />
      ) : solutionId === "wms" ? (
        <WMS_Quotation />
      ) : (
        <div className="text-center text-gray-500">
          <p>No solution selected or unsupported solution.</p>
          <p className="text-sm mt-2">
            Try: <code>?solution=ems</code>
          </p>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-hero flex">
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <SolutionContent />
        </Suspense>
      </main>
    </div>
  );
}
