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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        const updatedProfile: UserProfile = {
          name: data.name || defaultProfile.name,
          email: data.email || defaultProfile.email,
          dob: data.dob || defaultProfile.dob,
          phone: defaultProfile.phone,
          address: defaultProfile.address,
          panCard: defaultProfile.panCard,
        };
        
        setProfile(updatedProfile);
        
        // Save profile to localStorage for persistence
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      } else {
        console.log("No profile data found for user");
        // Try to load from localStorage as fallback
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user accounts, transactions, loans, and investments
  const fetchUserData = async (userId: string) => {
    if (!userId) return;
    
    try {
      // All these operations can happen in parallel for better performance
      await Promise.all([
        // These would normally fetch from their respective tables
        // but we'll keep the mock data for now
        fetchActivityLogs(userId)
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user activity logs from localStorage or create new
  const fetchActivityLogs = async (userId: string) => {
    try {
      // Try to get from localStorage first
      const storedLogs = localStorage.getItem(`activityLogs_${userId}`);
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setActivityLogs(parsedLogs);
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
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
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(() => {
          fetchUserProfile(data.user.id);
          fetchUserData(data.user.id);
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
      // Save any unsaved data before logging out
      if (user?.id) {
        const userLogsToSave = JSON.stringify(activityLogs);
        localStorage.setItem(`activityLogs_${user.id}`, userLogsToSave);
        localStorage.setItem("userProfile", JSON.stringify(profile));
      }
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      logActivity("Logout", "User logged out");
      
      // Don't clear profile on logout to maintain UI consistency
      // But mark as not authenticated
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
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...profileData };
    setProfile(updatedProfile);
    
    if (profileData.name && user) {
      const updatedUser = { ...user, name: profileData.name };
      setUser(updatedUser);
    }
    
    // Save to localStorage for persistence
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    
    // If authenticated, also update in database
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('customers')
          .update({ 
            name: updatedProfile.name,
            email: updatedProfile.email,
            dob: updatedProfile.dob
          })
          .eq('id', user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error("Error updating profile in database:", error);
      }
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
    
    // Store in localStorage for persistence, limited to 100 entries
    const logsToStore = updatedLogs.slice(0, 100);
    if (user?.id) {
      localStorage.setItem(`activityLogs_${user.id}`, JSON.stringify(logsToStore));
    } else {
      localStorage.setItem("activityLogs", JSON.stringify(logsToStore));
    }
    
    console.log("Activity logged:", action, details);
  };

  // Get recent activities
  const getRecentActivities = (limit = 10) => {
    return activityLogs.slice(0, limit);
  };

  useEffect(() => {
    // Start by setting up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAuthenticated(!!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("User signed in:", newSession.user);
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(() => {
          fetchUserProfile(newSession.user.id);
          fetchUserData(newSession.user.id);
        }, 0);
        logActivity("Sign In", "User signed in successfully");
      } else if (event === 'SIGNED_OUT') {
        logActivity("Sign Out", "User signed out");
      }
    });

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Current session:", currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
          fetchUserData(currentSession.user.id);
        }, 0);
        logActivity("Session Restored", "User session was restored");
      } else {
        setIsLoading(false);
      }
    });

    // Check for saved activity logs for non-authenticated users
    const guestLogs = localStorage.getItem("activityLogs");
    if (guestLogs) {
      setActivityLogs(JSON.parse(guestLogs));
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
