'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { signOut, useSession } from "next-auth/react";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  // 🔹 Logout handler
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  // Check authentication status
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

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
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {user?.email ? user.email.split('@')[0] : 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href={`/auth?from=${pathname}`}>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href={`/auth?from=${pathname}`}>Get Started</Link>
                </Button>
              </>
            )}
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
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    My Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push('/admin');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Admin Dashboard
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/auth?from=${pathname}`}>Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href={`/auth?from=${pathname}`}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};