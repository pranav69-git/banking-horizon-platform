
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
    
    // Set loading state to true at the beginning
    setIsLoading(true);
    
    // Function to update auth state
    const updateAuthState = async (newSession: any) => {
      if (!isMounted) return;
      
      console.log("Updating auth state with session:", newSession ? "exists" : "none");
      
      // Update session and user
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Set authentication state
      const isAuth = !!newSession?.user;
      setIsAuthenticated(isAuth);
      console.log("Authentication state set to:", isAuth);
      
      if (newSession?.user) {
        try {
          // Get email from session
          const email = newSession.user.email || "";
          const defaultName = email ? email.split('@')[0] : "User";
          
          // Set minimal profile immediately to avoid rendering issues
          setProfile({
            name: defaultName,
            email: email,
            phone: "", 
            address: "",
            dob: "",
            panCard: ""
          });
          
          // Then fetch complete profile in background
          const data = await fetchUserProfile(newSession.user.id);
          if (isMounted && data) {
            setProfile(data);
          }
          
          // Load activity logs
          const savedLogs = loadActivityLogs(newSession.user.id);
          setActivityLogs(savedLogs);
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          // Always set loading to false after all operations are complete
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        // Not authenticated, set loading to false immediately
        setIsLoading(false);
      }
    };
    
    // First check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      updateAuthState(currentSession);
    }).catch(error => {
      if (isMounted) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    });
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      updateAuthState(newSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setIsLoading, setProfile, setActivityLogs]);
};
