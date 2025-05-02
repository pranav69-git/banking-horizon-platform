
import { supabase } from "@/integrations/supabase/client";

export const loginWithEmail = async (email: string, password: string) => {
  try {
    // For demo purposes, simulate successful login
    // In a real app, uncomment the real authentication code below
    
    // Simulated login response for demo
    return { 
      success: true, 
      data: {
        user: {
          id: "demo-user-id",
          email: email,
          role: "customer"
        },
        session: {
          user: {
            id: "demo-user-id",
            email: email,
            role: "customer"
          },
          access_token: "demo-token",
          refresh_token: "demo-refresh-token",
          expires_at: Date.now() + 3600000 // 1 hour from now
        }
      }
    };

    /* Uncomment for real authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { success: true, data };
    */
  } catch (error: any) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to log in. Please check your credentials."
    };
  }
};

export const logoutUser = async () => {
  try {
    // For demo purposes, simulate successful logout
    // In a real app, uncomment the line below
    // await supabase.auth.signOut();
    
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to log out"
    };
  }
};
