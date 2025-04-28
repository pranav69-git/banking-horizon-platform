
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
    
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change event:", event);
      
      if (!isMounted) return;

      // Update session and authentication status
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAuthenticated(!!newSession?.user);
      
      console.log("Auth state updated:", !!newSession?.user);

      // If authenticated, fetch user profile
      if (newSession?.user) {
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
        
        // Load activity logs
        const savedLogs = loadActivityLogs(newSession.user.id);
        setActivityLogs(savedLogs);
        
        // Fetch complete profile in background
        fetchUserProfile(newSession.user.id)
          .then(data => {
            if (isMounted && data) {
              setProfile(data);
            }
          })
          .catch(err => console.error("Error fetching profile:", err))
          .finally(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          });
      } else {
        // Not authenticated
        setIsLoading(false);
      }
    });
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log("Initial session check:", session ? "Session exists" : "No session");
      
      // Update session and authentication status
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      // If authenticated, fetch user profile
      if (session?.user) {
        const email = session.user.email || "";
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
        
        // Load activity logs
        const savedLogs = loadActivityLogs(session.user.id);
        setActivityLogs(savedLogs);
        
        // Fetch complete profile in background
        fetchUserProfile(session.user.id)
          .then(data => {
            if (isMounted && data) {
              setProfile(data);
            }
          })
          .catch(err => console.error("Error fetching profile:", err))
          .finally(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          });
      } else {
        // Not authenticated
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("Error checking session:", error);
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setIsLoading, setProfile, setActivityLogs]);
};
