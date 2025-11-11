import AdminNavbar from "@/components/AdminNavbar";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen w-screen">
      <AdminNavbar/>
      <h1 className="text-5xl font-bold text-center my-16">Admin Panel</h1>
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold">Our Customers</h3>
        <div className="">

        </div>
      </div>
    </div>
  );
};

export default page;
