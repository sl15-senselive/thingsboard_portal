'use client';

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Package, Calendar, Server } from "lucide-react";

interface UserPurchase {
  id: string;
  user_email: string;
  solution_name: string;
  solution_type: string;
  total_price: number;
  device_count: number;
  purchase_date: string;
}

interface UserSubscription {
  id: string;
  user_email: string;
  subscription_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  solution_name: string;
}

interface DeviceAllocation {
  id: string;
  device_name: string;
  device_serial: string;
  status: string;
  user_email: string;
  solution_name: string;
  allocated_date: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [allPurchases, setAllPurchases] = useState<UserPurchase[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<UserSubscription[]>([]);
  const [allDevices, setAllDevices] = useState<DeviceAllocation[]>([]);

  useEffect(() => {
    // Simulate fetching data (mock)
    setTimeout(() => {
      setAllPurchases([
        {
          id: "1",
          user_email: "john@example.com",
          solution_name: "Smart Energy Monitor",
          solution_type: "IoT Solution",
          total_price: 1299.99,
          device_count: 5,
          purchase_date: "2025-10-01",
        },
        {
          id: "2",
          user_email: "alice@example.com",
          solution_name: "Industrial Gateway",
          solution_type: "Connectivity",
          total_price: 850.5,
          device_count: 2,
          purchase_date: "2025-09-15",
        },
      ]);

      setAllSubscriptions([
        {
          id: "1",
          user_email: "john@example.com",
          subscription_type: "Annual",
          start_date: "2025-01-01",
          end_date: "2025-12-31",
          is_active: true,
          solution_name: "Smart Energy Monitor",
        },
        {
          id: "2",
          user_email: "alice@example.com",
          subscription_type: "Monthly",
          start_date: "2025-09-01",
          end_date: "2025-09-30",
          is_active: false,
          solution_name: "Industrial Gateway",
        },
      ]);

      setAllDevices([
        {
          id: "1",
          device_name: "E7000 Controller",
          device_serial: "SL-E7-9001",
          status: "active",
          user_email: "john@example.com",
          solution_name: "Smart Energy Monitor",
          allocated_date: "2025-09-20",
        },
        {
          id: "2",
          device_name: "X5600 Gateway",
          device_serial: "SL-X5-1102",
          status: "inactive",
          user_email: "alice@example.com",
          solution_name: "Industrial Gateway",
          allocated_date: "2025-09-10",
        },
      ]);

      setLoading(false);
    }, 800);
  }, []);

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Badge variant="default" className="text-lg px-4 py-2">Administrator</Badge>
        </div>

        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              All Purchases
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Devices
            </TabsTrigger>
          </TabsList>

          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Client Purchases
                </CardTitle>
                <CardDescription>Monitor all customer solution purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Email</TableHead>
                      <TableHead>Solution</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Devices</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Purchase Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPurchases.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.user_email}</TableCell>
                        <TableCell>{p.solution_name}</TableCell>
                        <TableCell>{p.solution_type}</TableCell>
                        <TableCell>{p.device_count}</TableCell>
                        <TableCell className="font-semibold">${p.total_price.toFixed(2)}</TableCell>
                        <TableCell>{new Date(p.purchase_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  All Subscriptions
                </CardTitle>
                <CardDescription>Track all customer subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Email</TableHead>
                      <TableHead>Solution</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allSubscriptions.map((s) => {
                      const daysRemaining = calculateDaysRemaining(s.end_date);
                      return (
                        <TableRow key={s.id}>
                          <TableCell>{s.user_email}</TableCell>
                          <TableCell>{s.solution_name}</TableCell>
                          <TableCell>{s.subscription_type}</TableCell>
                          <TableCell>{new Date(s.start_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(s.end_date).toLocaleDateString()}</TableCell>
                          <TableCell className={daysRemaining < 30 ? "text-destructive font-semibold" : ""}>
                            {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={s.is_active && daysRemaining > 0 ? "default" : "destructive"}>
                              {s.is_active && daysRemaining > 0 ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  All Device Allocations
                </CardTitle>
                <CardDescription>Monitor all devices across customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Email</TableHead>
                      <TableHead>Solution</TableHead>
                      <TableHead>Device Name</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Allocated Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allDevices.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.user_email}</TableCell>
                        <TableCell>{d.solution_name}</TableCell>
                        <TableCell>{d.device_name}</TableCell>
                        <TableCell>{d.device_serial}</TableCell>
                        <TableCell>
                          <Badge variant={d.status === "active" ? "default" : "secondary"}>
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(d.allocated_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
