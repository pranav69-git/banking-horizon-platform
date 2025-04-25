
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { useUserContext } from "./contexts/UserContext";
import { useEffect } from "react";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RegistrationSuccess from "./pages/RegistrationSuccess";

// Customer Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import AccountsPage from "./pages/accounts/AccountsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import InvestmentsPage from "./pages/investments/InvestmentsPage";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import NewTransaction from "./pages/transactions/NewTransaction";
import LoansPage from "./pages/loans/LoansPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ActivityLogsPage from "./pages/activity/ActivityLogsPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUserContext();
  
  useEffect(() => {
    console.log("Protected route - Auth status:", isAuthenticated);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUserContext();
  
  useEffect(() => {
    console.log("Public route - Auth status:", isAuthenticated);
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth Routes - Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/registration-success" element={<PublicRoute><RegistrationSuccess /></PublicRoute>} />
      
      {/* Customer Dashboard Routes - Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/investments" element={<ProtectedRoute><InvestmentsPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/transactions/new" element={<ProtectedRoute><NewTransaction /></ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><ActivityLogsPage /></ProtectedRoute>} />
      
      {/* Admin Routes - Protected routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
