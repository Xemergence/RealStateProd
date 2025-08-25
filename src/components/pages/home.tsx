import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Building2, 
  CreditCard, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  Check,
  User,
  Settings
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.95)] backdrop-blur-md border-b border-gray-100">
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
        {/* Hero section */}
        <section className="relative py-24 px-6 text-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Powering Your Rentals & Homes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              The complete property management platform for landlords and
              tenants. Streamline payments, organize documents, and manage tasks
              effortlessly.
            </p>
            <div className="flex justify-center items-center mb-12">
              <Link to="/dashboard">
                <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Illustrative graphic */}
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                    <Home className="h-8 w-8 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        Property Owners
                      </div>
                      <div className="text-sm text-gray-600">
                        Manage your rentals
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                    <Building2 className="h-8 w-8 text-purple-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Tenants</div>
                      <div className="text-sm text-gray-600">
                        Simplify your rental experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
                Everything You Need in One Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to make property management
                effortless for both owners and tenants.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl w-fit">
                    <CreditCard className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Automated Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    Secure, automatic rent collection with instant notifications
                    and payment tracking for seamless transactions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl w-fit">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Document Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    Centralized, secure storage for leases, receipts, and
                    important documents with easy access and sharing.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl w-fit">
                    <CheckSquare className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Task Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    Streamlined maintenance requests, repair tracking, and task
                    assignment with real-time updates.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl w-fit">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Loan Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    Monitor mortgage payments, track equity growth, and manage
                    property investment performance.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the perfect plan for your property management needs. No
                hidden fees, cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card className="rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Free
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    $0
                    <span className="text-lg font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <CardDescription className="text-gray-600">
                    Perfect for getting started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Up to 2 properties</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Basic payment processing
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Document storage (1GB)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Email support</span>
                    </div>
                  </div>
                  <Button className="w-full rounded-full bg-gray-900 text-white hover:bg-gray-800 py-3 mt-8">
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>

              {/* Plus Plan */}
              <Card className="rounded-3xl border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Plus
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    $29
                    <span className="text-lg font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <CardDescription className="text-gray-600">
                    For growing property portfolios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Up to 10 properties</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Advanced payment features
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Unlimited document storage
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Task management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Priority support</span>
                    </div>
                  </div>
                  <Button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 py-3 mt-8">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Pro
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    $79
                    <span className="text-lg font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <CardDescription className="text-gray-600">
                    For professional property managers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Unlimited properties
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        All payment features
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Advanced loan tracking
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Custom reporting</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">24/7 phone support</span>
                    </div>
                  </div>
                  <Button className="w-full rounded-full bg-gray-900 text-white hover:bg-gray-800 py-3 mt-8">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">HomeHub</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The complete property management platform for modern landlords
                and tenants.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 HomeHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}