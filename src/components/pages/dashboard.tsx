import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import { RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/supabase/auth";
import { supabase } from "@/supabase/supabase";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();

  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [avgOccupancy, setAvgOccupancy] = useState<number>(0);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [openRequests, setOpenRequests] = useState<number>(0);
  const [thisMonthExpenses, setThisMonthExpenses] = useState<number>(0);

  useEffect(() => {
    const ensureDefaultOwnerProperty = async () => {
      if (!user || userProfile?.role !== "property_owner") return;
      const { data: existing } = await supabase
        .from("property_members")
        .select("property_id")
        .eq("user_id", user.id)
        .limit(1);
      if (existing && existing.length > 0) return;
      await supabase.from("properties").insert({
        address_line: "22913 Nowlin St",
        city: "Dearborn",
        state: "MI",
        postal_code: "48124",
        size_sqft: 1400,
        bedrooms: 3,
        bathrooms: 1.5,
        year_built: 1940,
        est_value: 280000,
        monthly_rent: 1800,
        occupancy_rate: 100,
      });
    };
    ensureDefaultOwnerProperty();
  }, [user, userProfile]);

  const fetchKPIs = async () => {
    if (!user) return;
    try {
      // Get properties for current user via membership
      const { data: memberships, error: memErr } = await supabase
        .from("property_members")
        .select("property_id, role")
        .eq("user_id", user.id);
      if (memErr) throw memErr;
      const propertyIds = (memberships || []).map((m) => m.property_id);
      if (!propertyIds.length) {
        setPropertyCount(0);
        setAvgOccupancy(0);
        setPortfolioValue(0);
        setOpenRequests(0);
        setThisMonthExpenses(0);
        return;
      }

      // Properties
      const { data: properties, error: propsErr } = await supabase
        .from("properties")
        .select("id, occupancy_rate, est_value")
        .in("id", propertyIds);
      if (propsErr) throw propsErr;
      setPropertyCount(properties?.length || 0);
      const occValues = (properties || []).map((p) =>
        Number(p.occupancy_rate || 0),
      );
      const avgOcc = occValues.length
        ? Math.round(occValues.reduce((a, b) => a + b, 0) / occValues.length)
        : 0;
      setAvgOccupancy(avgOcc);
      const valueSum = (properties || []).reduce(
        (sum, p) => sum + Number(p.est_value || 0),
        0,
      );
      setPortfolioValue(valueSum);

      // Maintenance (open requests)
      const { data: requests, error: reqErr } = await supabase
        .from("maintenance_requests")
        .select("id, status")
        .in("property_id", propertyIds)
        .eq("status", "open");
      if (reqErr) throw reqErr;
      setOpenRequests(requests?.length || 0);

      // Expenses (this month)
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const firstISO = first.toISOString().slice(0, 10);
      const lastISO = last.toISOString().slice(0, 10);
      const { data: expenses, error: expErr } = await supabase
        .from("expenses")
        .select("amount, incurred_on")
        .in("property_id", propertyIds)
        .gte("incurred_on", firstISO)
        .lte("incurred_on", lastISO);
      if (expErr) throw expErr;
      const monthTotal = (expenses || []).reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0,
      );
      setThisMonthExpenses(monthTotal);
    } catch (e) {
      // Silently fail KPIs to avoid breaking the UI
      console.error("Failed to fetch KPIs", e);
    }
  };

  useEffect(() => {
    fetchKPIs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Function to trigger loading state and refresh KPIs
  const handleRefresh = () => {
    setLoading(true);
    fetchKPIs().finally(() => setTimeout(() => setLoading(false), 500));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Top Navigation */}
      <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <Link to="/" className="font-semibold text-xl text-gray-900">
              HomeHub
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600 hidden md:block">
              Welcome
              {userProfile?.full_name
                ? `, ${userProfile.full_name}`
                : user?.email
                  ? `, ${user.email}`
                  : ""}
            </div>
            <Link to="/">
              <Button
                variant="ghost"
                className="text-sm font-medium hover:text-gray-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="text-sm font-medium hover:text-gray-700"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="container mx-auto px-6 pt-4 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Property Management Dashboard
              </h1>
              <p className="text-gray-600">
                Overview of your properties and tasks
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              className="rounded-full shadow-sm flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="tenants">Tenants</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div
                className={cn(
                  "container mx-auto p-0 space-y-8",
                  "transition-all duration-300 ease-in-out",
                )}
              >
                {/* KPIs */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Your Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-gray-900">
                        {propertyCount}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Total linked</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Avg Occupancy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-gray-900">
                        {avgOccupancy}%
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Portfolio-wide
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Open Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-gray-900">
                        {openRequests}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Maintenance items
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Expenses (This Month)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-gray-900">
                        ${thisMonthExpenses.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        All properties
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <DashboardGrid isLoading={loading} />
                <TaskBoard isLoading={loading} />
              </div>
            </TabsContent>

            <TabsContent value="properties">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Properties</CardTitle>
                    <CardDescription>
                      Total linked to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-semibold text-gray-900">
                      {propertyCount}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Avg Occupancy</CardTitle>
                    <CardDescription>Across all properties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-semibold text-gray-900">
                      {avgOccupancy}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Est. Portfolio Value</CardTitle>
                    <CardDescription>Sum of property values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-semibold text-gray-900">
                      ${portfolioValue.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tenants">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Tenants</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    We will show tenant roster and invites.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Payments</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    Connect payments to track rent.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Requests</CardTitle>
                    <CardDescription>Active maintenance items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-semibold text-gray-900">
                      {openRequests}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Create and track tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="rounded-full">
                      Add Maintenance Request
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="expenses">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>This Month</CardTitle>
                    <CardDescription>Total expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-semibold text-gray-900">
                      ${thisMonthExpenses.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Record new expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="rounded-full">
                      Add Expense
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
