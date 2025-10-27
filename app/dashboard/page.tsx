'use client';
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Package, Server } from "lucide-react";

// Interfaces
interface Purchase {
  id: string;
  solution_name: string;
  solution_type: string;
  base_price: number;
  total_price: number;
  device_count: number;
  purchase_date: string;
}

interface Subscription {
  id: string;
  subscription_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface Device {
  id: string;
  device_name: string;
  device_serial: string;
  status: string;
  allocated_date: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Simulate checking auth or data fetch delay
    setTimeout(() => {
      setLoading(false);

      // ✅ Sample static data (you can replace with real API later)
      setPurchases([
        {
          id: "1",
          solution_name: "Fleet Tracker",
          solution_type: "IoT",
          base_price: 500,
          total_price: 750,
          device_count: 5,
          purchase_date: "2025-09-01",
        },
      ]);

      setSubscriptions([
        {
          id: "1",
          subscription_type: "Annual",
          start_date: "2025-09-01",
          end_date: "2026-09-01",
          is_active: true,
        },
      ]);

      setDevices([
        {
          id: "1",
          device_name: "Tracker A1",
          device_serial: "SN123456",
          status: "active",
          allocated_date: "2025-09-02",
        },
      ]);
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
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        {/* Purchases Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Purchases
            </CardTitle>
            <CardDescription>View all your solution purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {purchases.length === 0 ? (
              <p className="text-muted-foreground">No purchases yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solution Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Purchase Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.solution_name}</TableCell>
                      <TableCell>{purchase.solution_type}</TableCell>
                      <TableCell>{purchase.device_count}</TableCell>
                      <TableCell>${purchase.base_price.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">${purchase.total_price.toFixed(2)}</TableCell>
                      <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Subscriptions Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Active Subscriptions
            </CardTitle>
            <CardDescription>Monitor your subscription status and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <p className="text-muted-foreground">No active subscriptions</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days Remaining</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => {
                    const daysRemaining = calculateDaysRemaining(subscription.end_date);
                    return (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.subscription_type}</TableCell>
                        <TableCell>{new Date(subscription.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(subscription.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={daysRemaining < 30 ? "text-destructive font-semibold" : ""}>
                            {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={subscription.is_active && daysRemaining > 0 ? "default" : "destructive"}>
                            {subscription.is_active && daysRemaining > 0 ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Devices Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              My Devices
            </CardTitle>
            <CardDescription>View all allocated devices</CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="text-muted-foreground">No devices allocated yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device Name</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Allocated Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.device_name}</TableCell>
                      <TableCell>{device.device_serial}</TableCell>
                      <TableCell>
                        <Badge variant={device.status === "active" ? "default" : "secondary"}>
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(device.allocated_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
