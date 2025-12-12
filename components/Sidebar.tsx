"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Briefcase,
  Package,
  Phone,
  ShoppingBagIcon,
  Scroll,
  CreditCard,
  ReceiptIndianRupee,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Solutions", path: "/solutions", icon: ShoppingBagIcon },
    { name: "Licenses", path: "/license", icon: Scroll },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Bills", path: "/bills", icon: ReceiptIndianRupee },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/LOGO ICON.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Senselive
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-60 bg-background border-r border-border transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 p-6 border-b border-border">
            <Image src="/LOGO ICON.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Senselive
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-1 rounded transition-colors ${
                      isActive
                        ? "bg-primary/5 text-cyan-500"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <User className="h-4 w-4" />
                      {user?.email ? user.email.split("@")[0] : "Account"}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    {/* ✅ Profile */}
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/profile"); // update route if needed
                        setSidebarOpen(false);
                      }}
                    >
                      Profile
                    </DropdownMenuItem>

                    {/* ✅ Logout */}
                    <DropdownMenuItem
                      onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/auth?from=${pathname}`}>Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href={`/auth?from=${pathname}`}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
};
