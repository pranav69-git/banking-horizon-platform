
import { Navigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";

const Index = () => {
  const { isAuthenticated, isLoading } = useUserContext();
  
  // Wait for authentication check to complete
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-banking-primary"></div>
      </div>
    );
  }
  
  // Redirect to dashboard if authenticated, otherwise to login
  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to dashboard from Index");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("User is not authenticated, redirecting to login from Index");
  return <Navigate to="/login" replace />;
};

export default Index;
