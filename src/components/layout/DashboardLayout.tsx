
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserContext } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, isLoading, profile, logActivity } = useUserContext();

  useEffect(() => {
    console.log("DashboardLayout - Auth state:", isAuthenticated, "Loading:", isLoading);
    
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated and not loading, redirecting to login");
      navigate("/login", { replace: true });
    }
    
    // Log page visit if authenticated
    if (isAuthenticated && !isLoading) {
      const pageName = location.pathname.split("/").filter(Boolean).pop() || "dashboard";
      logActivity("Page Visit", `Visited ${pageName} page`);
    }
    
  }, [navigate, location.pathname, isAuthenticated, isLoading, logActivity]);

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-banking-primary mb-4" />
        <p className="text-banking-primary">Loading your dashboard...</p>
      </div>
    );
  }

  // If not authenticated and not loading, the redirect will happen in useEffect
  // This is a safety check but we return the loading state to prevent flashes
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-banking-primary mb-4" />
        <p className="text-banking-primary">Redirecting to login...</p>
      </div>
    );
  }

  // If authenticated and not loading, show the dashboard
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar 
        userName={profile?.name || "User"} 
        userRole={user?.role || "customer"} 
      />
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "ml-0" : "ml-[250px]"
        }`}
      >
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
