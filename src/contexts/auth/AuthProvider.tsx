
import React, { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { UserProfile, ActivityLog, defaultProfile } from "../types/auth-types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Fetch user profile from customers table
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        console.log("Profile data fetched:", data);
        setProfile({
          ...profile,
          name: data.name || profile.name,
          email: data.email || profile.email,
          dob: data.dob || profile.dob,
        });
      } else {
        console.log("No profile data found for user");
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Login user
  const loginUser = async (email: string, password: string) => {
    try {
      console.log("Attempting to log in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setUser(data.user);
      setSession(data.session);
      setIsAuthenticated(true);
      
      if (data.user) {
        console.log("Login successful for user:", data.user.id);
        setTimeout(() => {
          fetchUserProfile(data.user.id);
        }, 0);
        logActivity("Login", "User logged in successfully");
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      logActivity("Login Failed", error.message);
      return { 
        success: false, 
        error: error.message || "Failed to log in. Please check your credentials."
      };
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      logActivity("Logout", "User logged out");
      setProfile(defaultProfile);
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Failed to log out"
      });
    }
  };

  // Update user data
  const updateUser = (userData: any) => {
    setUser(userData);
    logActivity("User Updated", "User information was updated");
  };

  // Update profile data
  const updateProfile = (profileData: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...profileData };
    setProfile(updatedProfile);
    
    if (profileData.name && user) {
      const updatedUser = { ...user, name: profileData.name };
      setUser(updatedUser);
    }
    
    logActivity("Profile Updated", "Profile information was updated");
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
  };

  // Log an activity
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      details,
      userId: user?.id || "guest"
    };
    
    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    
    const logsToStore = updatedLogs.slice(0, 100);
    localStorage.setItem("activityLogs", JSON.stringify(logsToStore));
    
    console.log("Activity logged:", action, details);
  };

  // Get recent activities
  const getRecentActivities = (limit = 10) => {
    return activityLogs.slice(0, limit);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAuthenticated(!!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("User signed in:", newSession.user);
        setTimeout(() => {
          fetchUserProfile(newSession.user.id);
        }, 0);
        logActivity("Sign In", "User signed in successfully");
      } else if (event === 'SIGNED_OUT') {
        logActivity("Sign Out", "User signed out");
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Current session:", currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
        logActivity("Session Restored", "User session was restored");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        activityLogs,
        updateUser,
        updateProfile,
        logActivity,
        getRecentActivities,
        loginUser,
        logoutUser,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
