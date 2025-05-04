
import { Navigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";

const Index = () => {
  const { isAuthenticated } = useUserContext();
  
  // Redirect to dashboard if authenticated, otherwise to login
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;
