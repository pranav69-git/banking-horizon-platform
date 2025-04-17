
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Define the user type
interface User {
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if the user is authenticated
    const storedUser = localStorage.getItem("bankingUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        if (parsedUser.isAuthenticated) {
          setUser(parsedUser);
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
  }, [navigate]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar userRole={user.role} />
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
