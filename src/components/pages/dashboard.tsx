import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import { RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  
  // Function to trigger loading state for demonstration
  const handleRefresh = () => {
    setLoading(true);
    // Reset loading after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
          <div className="flex items-center space-x-6">
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
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>
        </div>
        <div className={cn(
          "container mx-auto p-6 space-y-8",
          "transition-all duration-300 ease-in-out"
        )}>
          <DashboardGrid isLoading={loading} />
          <TaskBoard isLoading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;