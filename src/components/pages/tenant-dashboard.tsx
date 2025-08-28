import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Wallet, FileText, MessageSquare } from "lucide-react";
import { useAuth } from "@/supabase/auth";

export default function TenantDashboard() {
  const { user, userProfile } = useAuth();
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <Link to="/" className="font-semibold text-xl text-gray-900">
              HomeHub
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600 hidden md:block">Welcome{userProfile?.full_name ? `, ${userProfile.full_name}` : user?.email ? `, ${user.email}` : ''}</div>
            <Link to="/">
              <Button variant="ghost" className="text-sm font-medium hover:text-gray-700">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
            <p className="text-gray-600">Quick access to your rent, documents and requests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-green-600"/>Rent</CardTitle>
                <CardDescription>View upcoming rent and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full rounded-full">View payments</Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600"/>Documents</CardTitle>
                <CardDescription>Leases and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full rounded-full">Open</Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-purple-600"/>Requests</CardTitle>
                <CardDescription>Submit and track maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full rounded-full">Create request</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}