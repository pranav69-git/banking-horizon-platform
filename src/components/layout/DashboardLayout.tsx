
import { useEffect, useState } from "react";
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
  const { user, isAuthenticated, profile, logActivity } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("DashboardLayout - Auth state:", isAuthenticated);
    
    // Very short timeout to ensure auth state is up-to-date
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate("/login", { replace: true });
      } else {
        // Log page visit if authenticated
        const pageName = location.pathname.split("/").filter(Boolean).pop() || "dashboard";
        logActivity("Page Visit", `Visited ${pageName} page`);
        setIsLoading(false);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [navigate, location.pathname, isAuthenticated, logActivity]);

  // Return loading state if still loading and authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-banking-primary mb-4" />
        <p className="text-banking-primary">Loading your banking dashboard...</p>
      </div>
    );
  }

  // If authenticated, show the dashboard
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
