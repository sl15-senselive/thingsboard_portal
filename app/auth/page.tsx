"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
const Auth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  if (!searchParams) return null;
  const from = searchParams.get("from") || "/dashboard"; // fallback

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const res = await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 201) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        toast.success("Registration successfull!");
      } else {
        toast.error(res.data.message || "Registration failed");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        toast.success(`Account created for ${data.email}!`);
        router.push(from);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error: safe to read response
        toast.error(
          error.response?.data?.message || "Server responded with an error."
        );
      } else {
        // Non-Axios error (network, code issue, etc.)
        toast.error("Unexpected error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const res = await axios.post("/api/auth/login", { email, password });

      if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        toast.success(`Welcome back, ${email}!`);
        router.push(from);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute inset-0 -z-10 gradient-flow"></div>

      <div className="min-h-screen bg-transparent flex justify-center items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="shadow-large border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
                <CardDescription className="text-base">
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  {/* Sign In Form */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-primary cursor-pointer font-medium rounded-lg shadow-md hover:shadow-xl active:scale-95 active:shadow-sm transition-all duration-150 ease-in-out disabled:opacity-70"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-primary cursor-pointer font-medium rounded-lg shadow-md hover:shadow-xl active:scale-95 active:shadow-sm transition-all duration-150 ease-in-out disabled:opacity-70"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
