// src/lib/supabase/lessons.ts
import { supabase } from '../supabase';
import { 
  Lesson, 
  StudentLessonProgress, 
  QueryResult, 
  QueryResultArray,
  LessonWithProgress,
  StudentLessonProgressWithDetails,
  LessonStats
} from './types';

export class LessonService {
  /**
   * Get all active lessons
   */
  static async getLessons(): Promise<QueryResultArray<Lesson>> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get a specific lesson by ID
   */
  static async getLessonById(id: number): Promise<QueryResult<Lesson>> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get student's progress for a specific lesson
   */
  static async getLessonProgress(studentId: string, lessonId: number): Promise<QueryResult<StudentLessonProgress>> {
    try {
      const { data, error } = await supabase
        .from('student_lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get all progress for a student
   */
  static async getStudentProgress(studentId: string): Promise<QueryResultArray<StudentLessonProgress>> {
    try {
      const { data, error } = await supabase
        .from('student_lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .order('last_accessed', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Update lesson progress
   */
  static async updateLessonProgress(
    studentId: string,
    lessonId: number,
    updates: Partial<Omit<StudentLessonProgress, 'id' | 'student_id' | 'lesson_id' | 'created_at'>>
  ): Promise<QueryResult<StudentLessonProgress>> {
    try {
      // First, try to get existing progress
      const { data: existingProgress, error: getError } = await this.getLessonProgress(studentId, lessonId);

      let result: QueryResult<StudentLessonProgress>;

      if (existingProgress && !getError) {
        // Update existing progress
        const { data, error } = await supabase
          .from('student_lesson_progress')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId)
          .eq('lesson_id', lessonId)
          .select()
          .single();

        result = { data, error };
      } else {
        // Create new progress record
        const { data, error } = await supabase
          .from('student_lesson_progress')
          .insert({
            student_id: studentId,
            lesson_id: lessonId,
            ...updates,
            last_accessed: new Date().toISOString()
          })
          .select()
          .single();

        result = { data, error };
      }

      // Log activities for points
      if (result.data && !result.error) {
        // Award points for video completion
        if (updates.video_progress === 100) {
          await this.logActivity(studentId, 'video_watched', {
            lesson_id: lessonId,
            points_earned: 10
          }, 10);
          
          // Trigger notification event
          window.dispatchEvent(new CustomEvent('pointsEarned', {
            detail: { points: 10, activity: 'video_watched' }
          }));
        }

        // Award points for game completion
        if (updates.game_completed) {
          await this.logActivity(studentId, 'game_completed', {
            lesson_id: lessonId,
            points_earned: 15
          }, 15);
          
          // Trigger notification event
          window.dispatchEvent(new CustomEvent('pointsEarned', {
            detail: { points: 15, activity: 'game_completed' }
          }));
        }

        // Award points for quiz completion
        if (updates.quiz_completed) {
          await this.logActivity(studentId, 'quiz_completed', {
            lesson_id: lessonId,
            quiz_score: updates.quiz_score || 0,
            points_earned: 20
          }, 20);
          
          // Trigger notification event
          window.dispatchEvent(new CustomEvent('pointsEarned', {
            detail: { points: 20, activity: 'quiz_completed' }
          }));
        }

        // Check and update achievements after any progress update
        const { AchievementService } = await import('./achievements');
        await AchievementService.checkAchievements(studentId);
      }

      return result;
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Mark lesson as completed
   */
  static async completeLesson(studentId: string, lessonId: number, quizScore?: number): Promise<QueryResult<StudentLessonProgress>> {
    try {
      // Calculate points for lesson completion
      let pointsEarned = 50; // Base points for completing lesson
      if (quizScore && quizScore > 0) {
        pointsEarned += Math.round(quizScore / 10); // 1 point per 10% quiz score
      }

      const updates: Partial<StudentLessonProgress> = {
        is_completed: true,
        completed_at: new Date().toISOString(),
        video_progress: 100,
        game_completed: true,
        quiz_completed: true,
        quiz_score: quizScore || 0,
        points: pointsEarned
      };

      const result = await this.updateLessonProgress(studentId, lessonId, updates);

      // Log activity with calculated points
      if (result.data && !result.error) {
        await this.logActivity(studentId, 'lesson_completed', {
          lesson_id: lessonId,
          quiz_score: quizScore,
          points_earned: pointsEarned
        }, pointsEarned);

        // Check and update achievements
        const { AchievementService } = await import('./achievements');
        await AchievementService.checkAchievements(studentId);
      }

      return result;
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Log activity for points and achievements
   */
  private static async logActivity(
    studentId: string,
    activityType: string,
    metadata: any,
    points: number = 0
  ): Promise<void> {
    try {
      // Log the activity
      await supabase
        .from('activities')
        .insert({
          student_id: studentId,
          activity_type: activityType,
          points_earned: points,
          metadata: metadata,
          description: this.getActivityDescription(activityType, metadata)
        });

      // Update user's total points in profiles table
      if (points > 0) {
        await this.updateUserPoints(studentId, points);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Update user's total points
   */
  private static async updateUserPoints(studentId: string, points: number): Promise<void> {
    try {
      // Get current user points
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', studentId)
        .single();

      if (profile) {
        // Update total points
        await supabase
          .from('profiles')
          .update({ 
            total_points: (profile.total_points || 0) + points 
          })
          .eq('id', studentId);

        // Update leaderboard
        const { data: existingLeaderboard } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('student_id', studentId)
          .single();

        if (existingLeaderboard) {
          // Update existing entry
          await supabase
            .from('leaderboard')
            .update({
              total_points: (profile.total_points || 0) + points,
              points: (existingLeaderboard.points || 0) + points,
              updated_at: new Date().toISOString()
            })
            .eq('student_id', studentId);
        } else {
          // Create new entry
          await supabase
            .from('leaderboard')
            .insert({
              student_id: studentId,
              total_points: (profile.total_points || 0) + points,
              points: points,
              updated_at: new Date().toISOString()
            });
        }
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  }

  /**
   * Get activity description
   */
  private static getActivityDescription(activityType: string, metadata: any): string {
    switch (activityType) {
      case 'lesson_completed':
        return `Completed lesson with quiz score: ${metadata.quiz_score || 0}%`;
      case 'video_watched':
        return `Watched video for ${metadata.duration || 0} minutes`;
      case 'game_completed':
        return `Completed game for lesson ${metadata.lesson_id}`;
      default:
        return `Activity: ${activityType}`;
    }
  }

  /**
   * Get lesson statistics for dashboard
   */
  static async getLessonStats(studentId: string): Promise<LessonStats> {
    try {
      const { data: progress } = await this.getStudentProgress(studentId);
      const { data: lessons } = await this.getLessons();

      const totalLessons = lessons?.length || 0;
      const completedLessons = progress?.filter(p => p.is_completed).length || 0;
      const totalPoints = progress?.reduce((sum, p) => sum + (p.points || 0), 0) || 0;
      const averageScore = progress?.length > 0 
        ? progress.reduce((sum, p) => sum + p.quiz_score, 0) / progress.length 
        : 0;

      return {
        totalLessons,
        completedLessons,
        totalPoints,
        averageScore: Math.round(averageScore),
        progressByCategory: {}
      };
    } catch (error) {
      console.error('Error getting lesson stats:', error);
      return {
        totalLessons: 0,
        completedLessons: 0,
        totalPoints: 0,
        averageScore: 0,
        progressByCategory: {}
      };
    }
  }
}
