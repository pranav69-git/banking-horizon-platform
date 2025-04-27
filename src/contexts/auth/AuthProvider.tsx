
import React, { useEffect } from "react";
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

  // Set up auth effects
  useAuthEffects();

  // Log activity and update state
  const logActivity = (action: string, details: string) => {
    const newLog = createActivityLog(action, details, user?.id);
    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    saveActivityLogs(user?.id, updatedLogs);
    console.log("Activity logged:", action, details);
  };

  // Update user profile
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...profileData };
    setProfile(updatedProfile);
    saveProfileToStorage(updatedProfile);
    
    if (user?.id) {
      const success = await updateUserProfileInDB(user.id, profileData);
      if (success) {
        logActivity("Profile Updated", "Profile information was updated");
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully."
        });
      }
    }
  };

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    const result = await loginWithEmail(email, password);
    if (result.success) {
      setIsAuthenticated(true); // Explicitly set authentication state
      logActivity("Login", "User logged in successfully");
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  // Logout handler
  const handleLogout = async () => {
    // Save any unsaved data before logging out
    if (user?.id) {
      saveActivityLogs(user.id, activityLogs);
      saveProfileToStorage(profile);
    }
    
    const result = await logoutUser();
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: result.error
      });
    } else {
      setIsAuthenticated(false); // Explicitly clear authentication state
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
        isLoading // Added isLoading to the context value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
