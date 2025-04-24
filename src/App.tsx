import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/auth/AuthProvider";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            
            {/* Customer Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/investments" element={<InvestmentsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/new" element={<NewTransaction />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/activity" element={<ActivityLogsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
