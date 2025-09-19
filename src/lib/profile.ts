// src/lib/profile.ts
import { supabase } from './supabase';

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  user_id: string;
  type: string;
  points: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number;
  profiles?: {
    username: string;
  };
}

/**
 * Create a new user profile
 */
export async function createUserProfile(
  userId: string,
  username: string,
  email: string,
  role: UserRole = 'student'
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const profileData = {
      id: userId,
      username: username.trim(),
      email: email.trim(),
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create profile' 
      };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Profile creation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Profile creation failed' 
    };
  }
}

/**
 * Fetch user profile by ID
 */
export async function fetchUserProfile(
  userId: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch profile' 
      };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Profile fetch error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Profile fetch failed' 
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string, 
  updates: { username?: string; email?: string; role?: string }
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update profile' 
      };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Profile update error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Profile update failed' 
    };
  }
}

/**
 * Ensure user profile exists, create if missing
 */
export async function ensureUserProfile(
  userId: string, 
  username?: string, 
  email?: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    // First try to fetch existing profile
    const fetchResult = await fetchUserProfile(userId);
    
    if (fetchResult.success && fetchResult.profile) {
      return fetchResult;
    }

    // If no profile exists, create one
    if (username) {
      return await createUserProfile(userId, username, email || '', 'student');
    }

    return { 
      success: false, 
      error: 'No profile found and no username provided for creation' 
    };
  } catch (error) {
    console.error('Ensure profile error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Ensure profile failed' 
    };
  }
}

/**
 * Fetch leaderboard entries
 */
export async function fetchLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select(`
        id,
        user_id,
        points,
        profiles:user_id (
          username
        )
      `)
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return [];
  }
}

/**
 * Create an activity entry
 */
export async function createActivity(
  userId: string, 
  type: string, 
  points: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('activities')
      .insert([{
        user_id: userId,
        type: type.trim(),
        points: points,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error creating activity:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create activity' 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Activity creation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Activity creation failed' 
    };
  }
}

/**
 * Update leaderboard for a user
 */
export async function updateLeaderboard(
  userId: string, 
  points: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, try to get existing leaderboard entry
    const { data: existingEntry, error: fetchError } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching leaderboard entry:', fetchError);
      return { 
        success: false, 
        error: fetchError.message || 'Failed to fetch leaderboard entry' 
      };
    }

    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('leaderboard')
        .update({ 
          points: existingEntry.points + points,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating leaderboard:', updateError);
        return { 
          success: false, 
          error: updateError.message || 'Failed to update leaderboard' 
        };
      }
    } else {
      // Create new entry
      const { error: insertError } = await supabase
        .from('leaderboard')
        .insert([{
          user_id: userId,
          points: points,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error creating leaderboard entry:', insertError);
        return { 
          success: false, 
          error: insertError.message || 'Failed to create leaderboard entry' 
        };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Leaderboard update error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Leaderboard update failed' 
    };
  }
}
