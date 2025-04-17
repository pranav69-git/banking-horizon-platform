
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserContext } from "@/contexts/UserContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, updateUser, logActivity, profile } = useUserContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const storedUser = localStorage.getItem("bankingUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.isAuthenticated) {
          setIsAuthenticated(true);
          // Update user in context if needed
          if (!user) {
            updateUser(parsedUser);
          }
          // Log page visit
          const pageName = location.pathname.split("/").filter(Boolean).pop() || "dashboard";
          logActivity("Page Visit", `Visited ${pageName} page`);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, location.pathname, user, updateUser, logActivity]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar userName={profile.name} userRole={user?.role || "customer"} />
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
