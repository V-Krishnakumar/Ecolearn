import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  username: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Creates a user profile in the database
 * @param userId - The user's UUID
 * @param username - The user's display name
 * @param role - The user's role (default: 'student')
 * @returns Promise<{ success: boolean; error?: string; profile?: UserProfile }>
 */
export const createUserProfile = async (
  userId: string,
  username: string,
  role: string = 'student'
): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
  try {
    console.log('Creating profile with data:', { userId, username, role });
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username.trim(),
        role: role.trim(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    console.log('Profile creation response:', { data, error });

    if (error) {
      console.error('Profile creation error:', error);
      return { success: false, error: error.message };
    }

    console.log('Profile created successfully:', data);
    return { success: true, profile: data };
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Fetches a user profile from the database
 * @param userId - The user's UUID
 * @returns Promise<UserProfile | null>
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Profile fetch error:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

/**
 * Updates a user profile in the database
 * @param userId - The user's UUID
 * @param updates - Partial profile data to update
 * @returns Promise<{ success: boolean; error?: string; profile?: UserProfile }>
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<UserProfile, 'username' | 'role'>>
): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.username) updateData.username = updates.username.trim();
    if (updates.role) updateData.role = updates.role.trim();

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Ensures a user profile exists, creating one if it doesn't
 * @param userId - The user's UUID
 * @param username - The user's display name (fallback from user metadata)
 * @param role - The user's role (fallback from user metadata)
 * @returns Promise<UserProfile | null>
 */
export const ensureUserProfile = async (
  userId: string,
  username?: string,
  role: string = 'student'
): Promise<UserProfile | null> => {
  try {
    // First, try to fetch existing profile
    let profile = await fetchUserProfile(userId);
    
    if (profile) {
      return profile;
    }

    // If no profile exists, try to create one
    if (username) {
      const result = await createUserProfile(userId, username, role);
      if (result.success && result.profile) {
        return result.profile;
      }
    }

    // Fallback: get user data from auth
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const fallbackUsername = userData.user.user_metadata?.name || 
                              userData.user.email?.split('@')[0] || 
                              'User';
      const fallbackRole = userData.user.user_metadata?.role || 'student';
      
      const result = await createUserProfile(userId, fallbackUsername, fallbackRole);
      if (result.success && result.profile) {
        return result.profile;
      }
    }

    console.error('Failed to create or fetch profile for user:', userId);
    return null;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return null;
  }
};
