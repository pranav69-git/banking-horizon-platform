
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { useUserContext } from "./contexts/UserContext";
import { useEffect } from "react";
import { Skeleton } from "./components/ui/skeleton";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useUserContext();
  
  useEffect(() => {
    console.log("Protected route check - Auth state:", isAuthenticated, "Loading:", isLoading, "User:", user?.id ? "exists" : "none");
  }, [isAuthenticated, isLoading, user]);
  
  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center p-4">
        <Skeleton className="h-12 w-12 rounded-full bg-banking-primary/30" />
        <Skeleton className="h-4 w-[200px] bg-banking-primary/20" />
        <Skeleton className="h-4 w-[150px] bg-banking-primary/20" />
      </div>
    );
  }
  
  // After loading completes, redirect if not authenticated
  if (!isAuthenticated) {
    console.log("Protected route - Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useUserContext();
  
  useEffect(() => {
    console.log("Public route check - Auth state:", isAuthenticated, "Loading:", isLoading);
  }, [isAuthenticated, isLoading]);
  
  // During loading, always show the children
  if (isLoading) {
    return <>{children}</>;
  }

  // Only after loading completes, redirect if authenticated
  if (isAuthenticated) {
    console.log("Public route - Already authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoading } = useUserContext();
  
  // If the entire auth system is still initializing, show minimal loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full bg-banking-primary/30" />
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Redirect root to login or dashboard based on auth state */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Navigate to="/login" replace />
          </PublicRoute>
        } 
      />
      
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
