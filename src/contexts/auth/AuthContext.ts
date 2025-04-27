
import { createContext } from "react";
import { UserContextType, defaultProfile } from "../types/auth-types";

export const AuthContext = createContext<UserContextType>({
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
  isLoading: true, // Added with a default value of true
});
