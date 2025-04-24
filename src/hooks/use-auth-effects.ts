
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile } from "@/utils/profile-manager";
import { loadActivityLogs } from "@/utils/activity-logger";
import { useAuthState } from "./use-auth-state";

export const useAuthEffects = () => {
  const {
    setUser,
    setSession,
    setIsAuthenticated,
    setIsLoading,
    setProfile,
    setActivityLogs,
  } = useAuthState();

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
              const updatedProfile = {
                name: data.name || "",
                email: data.email || "",
                dob: data.dob || "",
                phone: "",
                address: "",
                panCard: "",
              };
              setProfile(updatedProfile);
            }
          });
          
          // Load activity logs
          const savedLogs = loadActivityLogs(newSession.user.id);
          setActivityLogs(savedLogs);
        }, 0);
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
  }, [setUser, setSession, setIsAuthenticated, setIsLoading, setProfile, setActivityLogs]);
};
