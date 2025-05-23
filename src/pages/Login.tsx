
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useUserContext } from "@/contexts/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserContext(); // Removed isLoading as we don't need it here
  
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // Show login form immediately without loading state
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
