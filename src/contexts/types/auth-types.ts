
import { Session } from "@supabase/supabase-js";

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  panCard: string;
};

export type ActivityLog = {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  userId: string;
};

export type UserContextType = {
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
  isLoading: boolean; // Added the missing isLoading property
};

export const defaultProfile: UserProfile = {
  name: "Vikram Sharma",
  email: "vikram.sharma@example.com",
  phone: "+91 9876543210",
  address: "123 MG Road, Bangalore, Karnataka 560001",
  dob: "1985-06-15",
  panCard: "ABCDE1234F"
};
