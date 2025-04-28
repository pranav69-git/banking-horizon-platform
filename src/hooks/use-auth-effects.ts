
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
        
        const savedLogs = loadActivityLogs(session.user.id);
        setActivityLogs(savedLogs);
        
        fetchUserProfile(session.user.id)
          .then(data => {
            if (isMounted && data) {
              setProfile(data);
            }
          })
          .catch(err => console.error("Error fetching profile:", err));
      }
      setIsLoading(false);
    });
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
      
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
        
        const savedLogs = loadActivityLogs(session.user.id);
        setActivityLogs(savedLogs);
        
        fetchUserProfile(session.user.id)
          .then(data => {
            if (isMounted && data) {
              setProfile(data);
            }
          })
          .catch(err => console.error("Error fetching profile:", err));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setIsLoading, setProfile, setActivityLogs]);
};
