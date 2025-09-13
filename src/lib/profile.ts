import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Activity {
  id: number;
  user_id: string;
  type: string;
  points: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: number;
  user_id: string;
  points: number;
  updated_at: string;
  profiles?: {
    username: string;
  };
}

/**
 * Creates a user profile in the database
 * @param userId - The user's UUID
 * @param username - The user's display name
 * @param email - The user's email address
 * @returns Promise<{ success: boolean; error?: string; profile?: UserProfile }>
 */
export const createUserProfile = async (
  userId: string,
  username: string,
  email: string
): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
  try {
    console.log('Creating profile with data:', { userId, username, email });
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username.trim(),
        email: email.trim()
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
  updates: Partial<Pick<UserProfile, 'username' | 'email'>>
): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
  try {
    const updateData: any = {};

    if (updates.username) updateData.username = updates.username.trim();
    if (updates.email) updateData.email = updates.email.trim();

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
 * @param email - The user's email address
 * @returns Promise<UserProfile | null>
 */
export const ensureUserProfile = async (
  userId: string,
  username?: string,
  email?: string
): Promise<UserProfile | null> => {
  try {
    // First, try to fetch existing profile
    let profile = await fetchUserProfile(userId);
    
    if (profile) {
      return profile;
    }

    // If no profile exists, try to create one
    if (username && email) {
      const result = await createUserProfile(userId, username, email);
      if (result.success && result.profile) {
        return result.profile;
      }
    }

    // No fallback needed for local auth system

    console.error('Failed to create or fetch profile for user:', userId);
    return null;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return null;
  }
};

/**
 * Creates a new activity entry
 * @param userId - The user's UUID
 * @param type - The type of activity
 * @param points - Points earned for this activity
 * @returns Promise<{ success: boolean; error?: string; activity?: Activity }>
 */
export const createActivity = async (
  userId: string,
  type: string,
  points: number
): Promise<{ success: boolean; error?: string; activity?: Activity }> => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        type: type.trim(),
        points: points
      })
      .select()
      .single();

    if (error) {
      console.error('Activity creation error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, activity: data };
  } catch (error) {
    console.error('Unexpected error creating activity:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Fetches activities for a user
 * @param userId - The user's UUID
 * @param limit - Maximum number of activities to fetch (default: 50)
 * @returns Promise<Activity[]>
 */
export const fetchUserActivities = async (
  userId: string,
  limit: number = 50
): Promise<Activity[]> => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching activities:', error);
    return [];
  }
};

/**
 * Updates or creates leaderboard entry for a user
 * @param userId - The user's UUID
 * @param points - Points to add to the user's total
 * @returns Promise<{ success: boolean; error?: string; entry?: LeaderboardEntry }>
 */
export const updateLeaderboard = async (
  userId: string,
  points: number
): Promise<{ success: boolean; error?: string; entry?: LeaderboardEntry }> => {
  try {
    // First, try to get existing entry
    const { data: existingEntry, error: fetchError } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching leaderboard entry:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (existingEntry) {
      // Update existing entry
      const { data, error } = await supabase
        .from('leaderboard')
        .update({
          points: existingEntry.points + points,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating leaderboard:', error);
        return { success: false, error: error.message };
      }

      return { success: true, entry: data };
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('leaderboard')
        .insert({
          user_id: userId,
          points: points
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating leaderboard entry:', error);
        return { success: false, error: error.message };
      }

      return { success: true, entry: data };
    }
  } catch (error) {
    console.error('Unexpected error updating leaderboard:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Fetches leaderboard entries with user profiles
 * @param limit - Maximum number of entries to fetch (default: 10)
 * @returns Promise<LeaderboardEntry[]>
 */
export const fetchLeaderboard = async (
  limit: number = 10
): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select(`
        *,
        profiles (username)
      `)
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching leaderboard:', error);
    return [];
  }
};

/**
 * Gets user's current leaderboard position and points
 * @param userId - The user's UUID
 * @returns Promise<{ position: number; points: number; totalUsers: number } | null>
 */
export const getUserLeaderboardStats = async (
  userId: string
): Promise<{ position: number; points: number; totalUsers: number } | null> => {
  try {
    // Get user's entry
    const { data: userEntry, error: userError } = await supabase
      .from('leaderboard')
      .select('points')
      .eq('user_id', userId)
      .single();

    if (userError || !userEntry) {
      return null;
    }

    // Get total count and user's position
    const { data: allEntries, error: allError } = await supabase
      .from('leaderboard')
      .select('points')
      .order('points', { ascending: false });

    if (allError) {
      console.error('Error fetching all leaderboard entries:', allError);
      return null;
    }

    const position = allEntries.findIndex(entry => entry.points <= userEntry.points) + 1;
    const totalUsers = allEntries.length;

    return {
      position,
      points: userEntry.points,
      totalUsers
    };
  } catch (error) {
    console.error('Unexpected error getting user leaderboard stats:', error);
    return null;
  }
};
