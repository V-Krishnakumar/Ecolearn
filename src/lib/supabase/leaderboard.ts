// src/lib/supabase/leaderboard.ts
import { supabase } from '../supabase';
import { 
  Leaderboard, 
  QueryResult, 
  QueryResultArray,
  LeaderboardStats,
  Profile
} from './types';

export class LeaderboardService {
  /**
   * Get leaderboard entries with profile information
   */
  static async getLeaderboard(limit: number = 10): Promise<QueryResultArray<Leaderboard & { profiles?: Profile }>> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles:student_id (
            id,
            username,
            email,
            avatar_url,
            total_points,
            level
          )
        `)
        .order('total_points', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get leaderboard entry for a specific student
   */
  static async getStudentLeaderboard(studentId: string): Promise<QueryResult<Leaderboard>> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('student_id', studentId)
        .single();

      // If no leaderboard entry exists, return null data instead of error
      if (error && error.code === 'PGRST116') {
        return { data: null, error: null };
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Update or create leaderboard entry for a student
   */
  static async updateLeaderboard(
    studentId: string, 
    points: number,
    weeklyPoints: number = 0,
    monthlyPoints: number = 0
  ): Promise<QueryResult<Leaderboard>> {
    try {
      // First, try to get existing entry
      const { data: existingEntry } = await this.getStudentLeaderboard(studentId);

      if (existingEntry) {
        // Update existing entry
        const { data, error } = await supabase
          .from('leaderboard')
          .update({
            points: existingEntry.points + points,
            total_points: existingEntry.total_points + points,
            weekly_points: existingEntry.weekly_points + weeklyPoints,
            monthly_points: existingEntry.monthly_points + monthlyPoints,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId)
          .select()
          .single();

        return { data, error };
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('leaderboard')
          .insert({
            student_id: studentId,
            points: points,
            total_points: points,
            weekly_points: weeklyPoints,
            monthly_points: monthlyPoints,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        return { data, error };
      }
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Update rank positions for all leaderboard entries
   */
  static async updateRankPositions(): Promise<{ success: boolean; error?: any }> {
    try {
      // Get all leaderboard entries ordered by total_points
      const { data: entries, error: fetchError } = await supabase
        .from('leaderboard')
        .select('id, total_points')
        .order('total_points', { ascending: false });

      if (fetchError) {
        return { success: false, error: fetchError };
      }

      if (!entries || entries.length === 0) {
        return { success: true };
      }

      // Update rank positions
      const updates = entries.map((entry, index) => ({
        id: entry.id,
        rank_position: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('leaderboard')
          .update({ rank_position: update.rank_position })
          .eq('id', update.id);

        if (error) {
          console.error('Error updating rank position:', error);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Get leaderboard statistics
   */
  static async getLeaderboardStats(studentId: string): Promise<LeaderboardStats> {
    try {
      // Get total participants
      const { count: totalParticipants } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true });

      // Get user's rank
      const { data: userEntry } = await this.getStudentLeaderboard(studentId);
      const userRank = userEntry?.rank_position || 0;

      // Get top participants
      const { data: topParticipants } = await this.getLeaderboard(10);

      return {
        totalParticipants: totalParticipants || 0,
        userRank,
        total_points: userEntry?.total_points || 0,
        topParticipants: topParticipants?.map((entry, index) => ({
          id: entry.student_id || '',
          username: entry.profiles?.username || 'Unknown',
          points: entry.total_points || 0,
          rank: entry.rank_position || index + 1
        })) || []
      };
    } catch (error) {
      console.error('Error getting leaderboard stats:', error);
      return {
        totalParticipants: 0,
        userRank: 0,
        total_points: 0,
        topParticipants: []
      };
    }
  }

  /**
   * Initialize leaderboard entry for a new user (only if doesn't exist)
   */
  static async initializeUserLeaderboard(studentId: string): Promise<{ success: boolean; error?: any }> {
    try {
      // First check if entry already exists
      const { data: existingEntry } = await this.getStudentLeaderboard(studentId);
      
      if (existingEntry) {
        // Entry already exists, no need to create
        return { success: true };
      }

      // Create new entry only if it doesn't exist
      const { data, error } = await supabase
        .from('leaderboard')
        .insert({
          student_id: studentId,
          points: 0,
          total_points: 0,
          weekly_points: 0,
          monthly_points: 0,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error initializing user leaderboard:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error initializing user leaderboard:', error);
      return { success: false, error };
    }
  }

  /**
   * Reset weekly points for all entries
   */
  static async resetWeeklyPoints(): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .update({ weekly_points: 0 })
        .neq('id', 0); // Update all entries

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Reset monthly points for all entries
   */
  static async resetMonthlyPoints(): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .update({ monthly_points: 0 })
        .neq('id', 0); // Update all entries

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }
}