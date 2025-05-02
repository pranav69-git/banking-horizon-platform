
import React, { useCallback } from "react";
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
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully."
        });
      }
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await loginWithEmail(email, password);
    setIsLoading(false);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to Banking Horizon!"
      });
      
      // Set authenticated state immediately on successful login
      if (result.data && result.data.session) {
        // Use the complete session object from the result
        setSession(result.data.session);
        setUser(result.data.user);
        setIsAuthenticated(true);
      }
      
      return { success: true };
    }
    
    toast({
      variant: "destructive",
      title: "Login Failed",
      description: result.error || "Invalid credentials. Please try again."
    });
    return { success: false, error: result.error };
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
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      
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
