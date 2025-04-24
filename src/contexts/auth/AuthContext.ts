
import { createContext, useContext } from "react";
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
});

export const useUserContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
