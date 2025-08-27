import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/components/pages/home";
import Dashboard from "@/components/pages/dashboard";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import TenantDashboard from "@/components/pages/tenant-dashboard";
import AuthCallback from "@/components/pages/auth-callback";
import ForgotPassword from "@/components/pages/forgot-password";
import ResetPassword from "@/components/pages/reset-password";
import { useAuth } from "../supabase/auth";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/tenant-dashboard"
        element={
          <RequireAuth>
            <TenantDashboard />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
