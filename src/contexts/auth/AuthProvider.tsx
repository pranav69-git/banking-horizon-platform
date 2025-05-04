
import React, { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/use-auth-state";
import { useAuthEffects } from "@/hooks/use-auth-effects";
import { saveActivityLogs, createActivityLog } from "@/utils/activity-logger";
import { saveProfileToStorage, updateUserProfileInDB } from "@/utils/profile-manager";
import { loginWithEmail, logoutUser } from "@/utils/auth-utils";
import { UserProfile } from "../types/auth-types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const {
    user,
    session,
    profile,
    activityLogs,
    isAuthenticated,
    isLoading,
    setUser,
    setSession,
    setProfile,
    setActivityLogs,
    setIsAuthenticated,
    setIsLoading,
  } = useAuthState();

  // Initialize auth effects - but don't wait for it to render UI
  useAuthEffects();

  const logActivity = useCallback((action: string, details: string) => {
    if (!user?.id) return;
    
    const newLog = createActivityLog(action, details, user.id);
    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    saveActivityLogs(user.id, updatedLogs);
  }, [user, activityLogs, setActivityLogs]);

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...profileData };
    setProfile(updatedProfile);
    saveProfileToStorage(updatedProfile);
    
    if (user?.id) {
      const success = await updateUserProfileInDB(user.id, profileData);
      if (success) {
        logActivity("Profile Updated", "Profile information was updated");
      }
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const result = await loginWithEmail(email, password);
      
      if (result.success) {
        // Set authenticated state immediately on successful login
        if (result.data && result.data.session) {
          // Use the complete session object from the result
          setSession(result.data.session);
          setUser(result.data.user);
          setIsAuthenticated(true);
          
          // Set default profile information
          const userName = email.split('@')[0] || "User";
          setProfile({
            name: userName,
            email: email,
            phone: "+91 9876543210", 
            address: "123 MG Road, Bangalore, Karnataka 560001",
            dob: "1985-06-15",
            panCard: "ABCDE1234F"
          });
          
          // Add login activity
          const userId = result.data.user?.id;
          if (userId) {
            const newLog = createActivityLog("Login", "User logged in", userId);
            const updatedLogs = [newLog];
            setActivityLogs(updatedLogs);
            saveActivityLogs(userId, updatedLogs);
          }
        }
        
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (user?.id) {
      saveActivityLogs(user.id, activityLogs);
      saveProfileToStorage(profile);
      logActivity("Logout", "User logged out of the system");
    }
    
    const result = await logoutUser();
    
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: result.error
      });
    } else {
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setProfile({
        name: "",
        email: "",
        phone: "", 
        address: "",
        dob: "",
        panCard: ""
      });
      setActivityLogs([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        activityLogs,
        updateUser: setProfile,
        updateProfile,
        logActivity,
        getRecentActivities: (limit = 10) => activityLogs.slice(0, limit),
        loginUser: handleLogin,
        logoutUser: handleLogout,
        isAuthenticated,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
