
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
    console.log("Setting up auth effects");
    let isMounted = true;
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      
      if (!isMounted) return;
      
      // Immediately update session and authentication state 
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Important: Set authentication state immediately
      const isAuth = !!newSession;
      setIsAuthenticated(isAuth);
      console.log("Authentication state set to:", isAuth);
      
      if (newSession?.user) {
        // Always set a minimal profile immediately to ensure rendering can proceed
        const email = newSession.user.email || "";
        const defaultName = email ? email.split('@')[0] : "User";
        
        // Set minimal profile immediately
        setProfile({
          name: defaultName,
          email: email,
          phone: "", 
          address: "",
          dob: "",
          panCard: ""
        });
        
        // Fetch full profile in background
        fetchUserProfile(newSession.user.id)
          .then(data => {
            if (!isMounted) return;
            if (data) {
              setProfile(data);
            }
          })
          .catch(error => {
            console.error("Error fetching profile:", error);
          })
          .finally(() => {
            if (isMounted) {
              // Ensure loading is complete
              setIsLoading(false);
            }
          });
          
        // Load activity logs
        const savedLogs = loadActivityLogs(newSession.user.id);
        setActivityLogs(savedLogs);
      } else {
        // No user in session, ensure loading is complete
        setIsLoading(false);
      }
    });

    // Check for existing session on initial load
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      
      // Immediately update session state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Important: Set authentication state immediately
      const isAuth = !!currentSession;
      setIsAuthenticated(isAuth);
      console.log("Initial authentication state set to:", isAuth);
      
      // Set a minimal default profile
      if (currentSession?.user) {
        const email = currentSession.user.email || "";
        const defaultName = email ? email.split('@')[0] : "User";
        
        // Set minimal profile immediately
        setProfile({
          name: defaultName,
          email: email,
          phone: "", 
          address: "",
          dob: "",
          panCard: ""
        });
        
        // Fetch full profile in background
        fetchUserProfile(currentSession.user.id)
          .then(data => {
            if (!isMounted) return;
            if (data) {
              setProfile(data);
            }
          })
          .catch(error => {
            console.error("Error fetching profile:", error);
          })
          .finally(() => {
            if (isMounted) {
              // Ensure loading is complete
              setIsLoading(false);
            }
          });
      } else {
        // No session, so no need to keep loading
        setIsLoading(false);
      }
    }).catch(error => {
      if (isMounted) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    });

    // Load guest activity logs
    const guestLogs = loadActivityLogs(undefined);
    if (guestLogs.length > 0 && isMounted) {
      setActivityLogs(guestLogs);
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setIsLoading, setProfile, setActivityLogs]);
};
