
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
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfileInDB = async (
  userId: string,
  profileData: Partial<UserProfile>
) => {
  try {
    const { error } = await supabase
      .from('customers')
      .update(profileData)
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating profile in database:", error);
    return false;
  }
};
