
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { UserProfile, ActivityLog, defaultProfile } from "@/contexts/types/auth-types";

export const useAuthState = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return {
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
  };
};
