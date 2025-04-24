
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Define types for user profile
export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  panCard: string;
};

// Define types for activity logs
export type ActivityLog = {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  userId: string;
};

// Context type definition
type UserContextType = {
  user: any;
  session: Session | null;
  profile: UserProfile;
  activityLogs: ActivityLog[];
  updateUser: (userData: any) => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  logActivity: (action: string, details: string) => void;
  getRecentActivities: (limit?: number) => ActivityLog[];
  loginUser: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
  logoutUser: () => Promise<void>;
  isAuthenticated: boolean;
};

// Default values
const defaultProfile: UserProfile = {
  name: "Vikram Sharma",
  email: "vikram.sharma@example.com",
  phone: "+91 9876543210",
  address: "123 MG Road, Bangalore, Karnataka 560001",
  dob: "1985-06-15",
  panCard: "ABCDE1234F"
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  profile: defaultProfile,
  activityLogs: [],
  updateUser: () => {},
  updateProfile: () => {},
  logActivity: () => {},
  getRecentActivities: () => [],
  loginUser: async () => ({ success: false }),
  logoutUser: async () => {},
  isAuthenticated: false,
});

// Custom hook to use the user context
export const useUserContext = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);

  // Check for existing session on initial render
  useEffect(() => {
    // Listen for auth state changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAuthenticated(!!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("User signed in:", newSession.user);
        // Defer profile fetch to avoid auth deadlock
        setTimeout(() => {
          fetchUserProfile(newSession.user.id);
        }, 0);
        logActivity("Sign In", "User signed in successfully");
      } else if (event === 'SIGNED_OUT') {
        logActivity("Sign Out", "User signed out");
      }
    });

    // Then get current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Current session:", currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        // Defer profile fetch to avoid auth deadlock
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
        logActivity("Session Restored", "User session was restored");
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

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
        // Update profile with data from database
        setProfile({
          ...profile,
          name: data.name || profile.name,
          email: data.email || profile.email,
          dob: data.dob || profile.dob,
        });
        setIsProfileLoaded(true);
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
        // Defer profile fetch to avoid auth deadlock
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
    
    // Also update the user name if it's changed in the profile
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
    
    // Store in localStorage (limit to 100 most recent logs)
    const logsToStore = updatedLogs.slice(0, 100);
    localStorage.setItem("activityLogs", JSON.stringify(logsToStore));
    
    console.log("Activity logged:", action, details);
  };

  // Get recent activities
  const getRecentActivities = (limit = 10) => {
    return activityLogs.slice(0, limit);
  };

  return (
    <UserContext.Provider
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
    </UserContext.Provider>
  );
};
