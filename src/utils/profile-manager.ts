
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/contexts/types/auth-types";

export const saveProfileToStorage = (profile: UserProfile) => {
  try {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile to storage:", e);
  }
};

export const loadProfileFromStorage = (): UserProfile | null => {
  try {
    const savedProfile = localStorage.getItem("userProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  } catch (e) {
    console.error("Failed to load profile from storage:", e);
    return null;
  }
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Try to get profile from storage first for immediate display
    const profileFromStorage = loadProfileFromStorage();
    
    // If we have a profile in storage with a name, use it immediately
    if (profileFromStorage && profileFromStorage.name) {
      // Start fetching from DB in background, but return storage data immediately
      fetchProfileFromDB(userId).then(dbProfile => {
        if (dbProfile) {
          // Update storage with latest DB data
          saveProfileToStorage({ 
            ...profileFromStorage, 
            ...dbProfile 
          });
        }
      }).catch(err => {
        console.error("Background profile fetch failed:", err);
      });
      
      return profileFromStorage;
    }
    
    // If no usable profile in storage, fetch from DB
    const dbProfile = await fetchProfileFromDB(userId);
    if (dbProfile) {
      // Save to storage for future use
      saveProfileToStorage(dbProfile);
      return dbProfile;
    }
    
    // Create a default profile object if nothing found
    const defaultProfile: UserProfile = {
      name: "User",
      email: "",
      phone: "",
      address: "",
      dob: "",
      panCard: ""
    };

    // Save the default to storage
    saveProfileToStorage(defaultProfile);
    return defaultProfile;
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    // Create a default profile as fallback
    const defaultProfile: UserProfile = {
      name: "User",
      email: "",
      phone: "",
      address: "",
      dob: "",
      panCard: ""
    };
    
    // Save the default to storage
    saveProfileToStorage(defaultProfile);
    return defaultProfile;
  }
};

// Helper function to fetch profile from database
const fetchProfileFromDB = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!customerError && customerData) {
      // Map the customer data to the UserProfile structure
      return {
        name: customerData.name || "",
        email: customerData.email || "",
        dob: customerData.dob || "",
        phone: "",  // Default value as it doesn't exist in customers table
        address: "", // Default value as it doesn't exist in customers table
        panCard: "" // Default value as it doesn't exist in customers table
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching profile from DB:', error);
    return null;
  }
};

export const updateUserProfileInDB = async (
  userId: string,
  profileData: Partial<UserProfile>
) => {
  try {
    // First check if record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', userId)
      .single();
    
    // Map UserProfile to customers table schema
    const customerData: any = {
      name: profileData.name || "",
      email: profileData.email || "",
      dob: profileData.dob || "",
      acc_type: "personal" // Add required field with default value
    };
    
    if (checkError && checkError.code === 'PGRST116') {
      // Record doesn't exist, insert it
      const { error: insertError } = await supabase
        .from('customers')
        .insert([{ id: userId, ...customerData }]);
        
      if (insertError) throw insertError;
    } else {
      // Record exists, update it
      const { error: updateError } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', userId);
        
      if (updateError) throw updateError;
    }
    
    // Save to local storage for backup with all fields
    const currentProfile = loadProfileFromStorage() || {};
    saveProfileToStorage({ ...currentProfile, ...profileData } as UserProfile);
    
    return true;
  } catch (error) {
    console.error("Error updating profile in database:", error);
    // Save to local storage anyway
    const currentProfile = loadProfileFromStorage() || {};
    saveProfileToStorage({ ...currentProfile, ...profileData } as UserProfile);
    return false;
  }
};
