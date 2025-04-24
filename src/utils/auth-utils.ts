
import { supabase } from "@/integrations/supabase/client";

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { success: true, data };
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
    await supabase.auth.signOut();
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to log out"
    };
  }
};
