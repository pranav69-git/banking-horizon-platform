import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  profile: UserProfile;
  activityLogs: ActivityLog[];
  updateUser: (userData: any) => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  logActivity: (action: string, details: string) => void;
  getRecentActivities: (limit?: number) => ActivityLog[];
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
  profile: defaultProfile,
  activityLogs: [],
  updateUser: () => {},
  updateProfile: () => {},
  logActivity: () => {},
  getRecentActivities: () => [],
});

// Custom hook to use the user context
export const useUserContext = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("bankingUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Load profile from localStorage if it exists
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        // Otherwise set default profile based on user data
        setProfile({
          ...defaultProfile,
          name: userData.name || defaultProfile.name,
          email: userData.email || defaultProfile.email
        });
      }

      // Load activity logs if they exist
      const storedLogs = localStorage.getItem("activityLogs");
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        // Convert string timestamps back to Date objects
        const logsWithDateObjects = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        setActivityLogs(logsWithDateObjects);
      }
    }
  }, []);

  // Update user data
  const updateUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem("bankingUser", JSON.stringify(userData));
    logActivity("User Updated", "User information was updated");
  };

  // Update profile data
  const updateProfile = (profileData: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...profileData };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    
    // Also update the user name if it's changed in the profile
    if (profileData.name && user) {
      const updatedUser = { ...user, name: profileData.name };
      setUser(updatedUser);
      localStorage.setItem("bankingUser", JSON.stringify(updatedUser));
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
        profile,
        activityLogs,
        updateUser,
        updateProfile,
        logActivity,
        getRecentActivities
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
