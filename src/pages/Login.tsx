
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useUserContext } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("Login page - Authentication state:", isAuthenticated);
    const timer = setTimeout(() => {
      setCheckingAuth(false);
      if (isAuthenticated) {
        console.log("Already authenticated, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-banking-primary" />
      </div>
    );
  }

  // Only show login form if not authenticated
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-banking-primary">Banking Horizon</h1>
        <p className="text-muted-foreground">Secure banking platform for all your financial needs</p>
      </div>
      <LoginForm />
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Need an account? <a href="/register" className="text-banking-primary hover:underline">Register here</a></p>
      </div>
    </div>
  );
}
