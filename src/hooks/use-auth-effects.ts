
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

    // Set isLoading to true initially
    setIsLoading(true);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      if (session?.user) {
        const email = session.user.email || "";
        const defaultName = email ? email.split('@')[0] : "User";
          
        setProfile({
          name: defaultName,
          email: email,
          phone: "", 
          address: "",
          dob: "",
          panCard: ""
        });
        
        // Defer loading activity logs to avoid auth deadlock
        setTimeout(() => {
          if (!isMounted) return;
          const savedLogs = loadActivityLogs(session.user.id);
          setActivityLogs(savedLogs);
        }, 0);
        
        // Defer fetching user profile to avoid auth deadlock
        setTimeout(() => {
          if (!isMounted) return;
          fetchUserProfile(session.user.id)
            .then(data => {
              if (isMounted && data) {
                setProfile(data);
              }
            })
            .catch(err => console.error("Error fetching profile:", err));
        }, 0);
      }
      
      // Always set loading to false after auth state change is processed
      setIsLoading(false);
    });
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      if (session?.user) {
        const email = session.user.email || "";
        const defaultName = email ? email.split('@')[0] : "User";
        setProfile({
          name: defaultName,
          email: email,
          phone: "", 
          address: "",
          dob: "",
          panCard: ""
        });
        
        // Load user's activity logs
        const savedLogs = loadActivityLogs(session.user.id);
        setActivityLogs(savedLogs);
        
        // Fetch user profile data
        fetchUserProfile(session.user.id)
          .then(data => {
            if (isMounted && data) {
              setProfile(data);
            }
          })
          .catch(err => console.error("Error fetching profile:", err));
      }
      
      // Set loading state to false after session check completes
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setIsLoading, setProfile, setActivityLogs]);
};
