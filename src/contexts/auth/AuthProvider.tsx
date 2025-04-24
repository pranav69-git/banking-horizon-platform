
import React, { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { UserProfile, ActivityLog, defaultProfile } from "../types/auth-types";
import { saveActivityLogs, loadActivityLogs, createActivityLog } from "@/utils/activity-logger";
import { saveProfileToStorage, loadProfileFromStorage, fetchUserProfile, updateUserProfileInDB } from "@/utils/profile-manager";
import { loginWithEmail, logoutUser } from "@/utils/auth-utils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    }
  };

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAuthenticated(!!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(() => {
          fetchUserProfile(newSession.user.id).then(data => {
            if (data) {
              const updatedProfile: UserProfile = {
                name: data.name || defaultProfile.name,
                email: data.email || defaultProfile.email,
                dob: data.dob || defaultProfile.dob,
                phone: defaultProfile.phone,
                address: defaultProfile.address,
                panCard: defaultProfile.panCard,
              };
              setProfile(updatedProfile);
              saveProfileToStorage(updatedProfile);
            }
          });
          
          // Load activity logs
          const savedLogs = loadActivityLogs(newSession.user.id);
          setActivityLogs(savedLogs);
        }, 0);
        
        logActivity("Sign In", "User signed in successfully");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
      }
      
      setIsLoading(false);
    });

    // Load guest activity logs
    const guestLogs = loadActivityLogs(undefined);
    if (guestLogs.length > 0) {
      setActivityLogs(guestLogs);
    }

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        activityLogs,
        updateUser: setUser,
        updateProfile,
        logActivity,
        getRecentActivities: (limit = 10) => activityLogs.slice(0, limit),
        loginUser: handleLogin,
        logoutUser: handleLogout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
