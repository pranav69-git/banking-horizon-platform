
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/contexts/types/auth-types";

export const saveProfileToStorage = (profile: UserProfile) => {
  localStorage.setItem("userProfile", JSON.stringify(profile));
};

export const loadProfileFromStorage = (): UserProfile | null => {
  const savedProfile = localStorage.getItem("userProfile");
  return savedProfile ? JSON.parse(savedProfile) : null;
};

export const fetchUserProfile = async (userId: string) => {
  try {
    // First try to fetch from customers table
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!customerError && customerData) {
      return customerData;
    }
    
    // If no customer record found, use profile from storage as backup
    console.log("No customer record found, using profile from storage");
    const profileFromStorage = loadProfileFromStorage();
    if (profileFromStorage) {
      return profileFromStorage;
    }
    
    // Create a default profile object
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Return profile from storage as fallback
    const profileFromStorage = loadProfileFromStorage();
    return profileFromStorage;
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
    
    if (checkError && checkError.code === 'PGRST116') {
      // Record doesn't exist, insert it
      const { error: insertError } = await supabase
        .from('customers')
        .insert({ id: userId, ...profileData });
        
      if (insertError) throw insertError;
    } else {
      // Record exists, update it
      const { error: updateError } = await supabase
        .from('customers')
        .update(profileData)
        .eq('id', userId);
        
      if (updateError) throw updateError;
    }
    
    // Save to local storage for backup
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
