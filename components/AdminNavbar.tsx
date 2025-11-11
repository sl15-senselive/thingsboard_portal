'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { name: "Home", path: "/admin" },
  { name: "Solutions", path: "/admin/solutions" },
  { name: "Products", path: "/admin/products" },
  { name: "Buyers", path: "/admin/buyers" },
  { name: "Customers", path: "/admin/customers" }
];
const AdminNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/LOGO ICON.png" alt="Logo" width={50} height={100} />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Senselive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4 bg-gradient-primary p-2 rounded-full text-white cursor-pointer">
            <Link href={'/'}><ArrowLeft className="inline-block h-6 w-6" /></Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 space-y-2">
             <ArrowLeft className="inline-block mr-2 h-4 w-4" />
              <Button
                onClick={() => {
                  // Handle logout logic here
                  router.push("/admin/login");
                }}
                className="w-full text-left text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
