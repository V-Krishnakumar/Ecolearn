// src/lib/supabase/achievements.ts
import { supabase } from '../supabase';
import { 
  Achievement, 
  StudentAchievement, 
  AchievementStats, 
  QueryResult, 
  QueryResultArray,
  StudentAchievementWithDetails,
  AchievementWithProgress
} from './types';

export class AchievementService {
  /**
   * Get all active achievements
   */
  static async getAchievements(): Promise<QueryResultArray<Achievement>> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points', { ascending: true });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get student's achievements
   */
  static async getStudentAchievements(studentId: string): Promise<QueryResultArray<StudentAchievementWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('student_id', studentId)
        .order('unlocked_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get unlocked achievements for a student
   */
  static async getUnlockedAchievements(studentId: string): Promise<QueryResultArray<StudentAchievementWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('student_id', studentId)
        .eq('is_unlocked', true)
        .order('unlocked_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get recent achievements (last 7 days)
   */
  static async getRecentAchievements(studentId: string): Promise<QueryResultArray<StudentAchievementWithDetails>> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('student_id', studentId)
        .eq('is_unlocked', true)
        .gte('unlocked_at', sevenDaysAgo.toISOString())
        .order('unlocked_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Update achievement progress
   */
  static async updateAchievementProgress(
    studentId: string,
    achievementId: number,
    progress: number,
    shouldUnlock: boolean = false
  ): Promise<QueryResult<StudentAchievement>> {
    try {
      // Check if achievement record exists
      const { data: existingAchievement } = await supabase
        .from('student_achievements')
        .select('*')
        .eq('student_id', studentId)
        .eq('achievement_id', achievementId)
        .single();

      if (existingAchievement) {
        // Update existing record
        const { data, error } = await supabase
          .from('student_achievements')
          .update({
            progress: Math.min(progress, 100),
            is_unlocked: shouldUnlock || existingAchievement.is_unlocked,
            unlocked_at: shouldUnlock && !existingAchievement.is_unlocked 
              ? new Date().toISOString() 
              : existingAchievement.unlocked_at
          })
          .eq('student_id', studentId)
          .eq('achievement_id', achievementId)
          .select()
          .single();

        return { data, error };
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('student_achievements')
          .insert({
            student_id: studentId,
            achievement_id: achievementId,
            progress: Math.min(progress, 100),
            is_unlocked: shouldUnlock,
            unlocked_at: shouldUnlock ? new Date().toISOString() : null
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
   * Check and unlock achievements based on student activity
   */
  static async checkAchievements(studentId: string): Promise<{ newAchievements: Achievement[]; error: any }> {
    try {
      const newAchievements: Achievement[] = [];

      // Get all active achievements
      const { data: achievements } = await this.getAchievements();
      if (!achievements) return { newAchievements, error: null };

      // Get student's current achievements
      const { data: studentAchievements } = await this.getStudentAchievements(studentId);
      const unlockedAchievementIds = new Set(
        studentAchievements?.filter(sa => sa.is_unlocked).map(sa => sa.achievement_id) || []
      );

      // Get student's activities for checking requirements
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('student_id', studentId);

      // Get student's lesson progress
      const { data: lessonProgress } = await supabase
        .from('student_lesson_progress')
        .select('*')
        .eq('student_id', studentId);

      // Check each achievement
      for (const achievement of achievements) {
        const isUnlocked = unlockedAchievementIds.has(achievement.id);
        
        // Calculate progress for this achievement
        const progress = this.calculateAchievementProgress(
          achievement,
          activities || [],
          lessonProgress || []
        );

        if (isUnlocked) {
          // Update progress for already unlocked achievements
          await this.updateAchievementProgress(studentId, achievement.id, 100, true);
        } else {
          // Check if achievement should be unlocked
          const shouldUnlock = this.checkAchievementRequirements(
            achievement,
            activities || [],
            lessonProgress || []
          );

          if (shouldUnlock) {
            // Unlock the achievement
            const { data: unlockedAchievement } = await this.updateAchievementProgress(
              studentId,
              achievement.id,
              100,
              true
            );

            if (unlockedAchievement) {
              newAchievements.push(achievement);

              // Create notification
              await this.createNotification(studentId, {
                title: 'Achievement Unlocked! 🎉',
                message: `You unlocked: ${achievement.name}`,
                type: 'achievement',
                action_url: '/achievements'
              });

              // Log activity
              await this.logActivity(studentId, 'achievement_unlocked', {
                achievement_id: achievement.id,
                achievement_name: achievement.name,
                points_earned: achievement.points
              }, achievement.points);
            }
          } else {
            // Update progress for locked achievements
            await this.updateAchievementProgress(studentId, achievement.id, progress, false);
          }
        }
      }

      return { newAchievements, error: null };
    } catch (error) {
      return { newAchievements: [], error };
    }
  }

  /**
   * Check if achievement requirements are met
   */
  private static checkAchievementRequirements(
    achievement: Achievement,
    activities: any[],
    lessonProgress: any[]
  ): boolean {
    if (!achievement.requirements) return false;

    const requirements = achievement.requirements;

    // Check lesson completion requirements
    if (requirements.lessons_completed) {
      const completedLessons = lessonProgress.filter(lp => lp.is_completed).length;
      if (completedLessons < requirements.lessons_completed) return false;
    }

    // Check quiz score requirements
    if (requirements.perfect_quizzes) {
      const perfectQuizzes = lessonProgress.filter(lp => lp.quiz_score === 100).length;
      if (perfectQuizzes < requirements.perfect_quizzes) return false;
    }

    // Check points requirements
    if (requirements.total_points) {
      const totalPoints = activities.reduce((sum, activity) => sum + (activity.points_earned || 0), 0);
      if (totalPoints < requirements.total_points) return false;
    }

    // Check consecutive days requirement
    if (requirements.consecutive_days) {
      const consecutiveDays = this.calculateConsecutiveDays(activities);
      if (consecutiveDays < requirements.consecutive_days) return false;
    }

    // Check specific activity types
    if (requirements.activity_types) {
      for (const [activityType, count] of Object.entries(requirements.activity_types)) {
        const activityCount = activities.filter(a => a.activity_type === activityType).length;
        if (activityCount < (count as number)) return false;
      }
    }

    return true;
  }

  /**
   * Calculate achievement progress percentage
   */
  private static calculateAchievementProgress(
    achievement: Achievement,
    activities: any[],
    lessonProgress: any[]
  ): number {
    if (!achievement.requirements) return 0;

    const requirements = achievement.requirements;
    let progress = 0;
    let totalWeight = 0;

    // Calculate lesson completion progress
    if (requirements.lessons_completed) {
      const completedLessons = lessonProgress.filter(lp => lp.is_completed).length;
      const lessonProgressPercent = Math.min((completedLessons / requirements.lessons_completed) * 100, 100);
      progress += lessonProgressPercent;
      totalWeight += 1;
    }

    // Calculate quiz score progress
    if (requirements.perfect_quizzes) {
      const perfectQuizzes = lessonProgress.filter(lp => lp.quiz_score === 100).length;
      const quizProgressPercent = Math.min((perfectQuizzes / requirements.perfect_quizzes) * 100, 100);
      progress += quizProgressPercent;
      totalWeight += 1;
    }

    // Calculate points progress
    if (requirements.total_points) {
      const totalPoints = activities.reduce((sum, activity) => sum + (activity.points_earned || 0), 0);
      const pointsProgressPercent = Math.min((totalPoints / requirements.total_points) * 100, 100);
      progress += pointsProgressPercent;
      totalWeight += 1;
    }

    // Calculate consecutive days progress
    if (requirements.consecutive_days) {
      const consecutiveDays = this.calculateConsecutiveDays(activities);
      const daysProgressPercent = Math.min((consecutiveDays / requirements.consecutive_days) * 100, 100);
      progress += daysProgressPercent;
      totalWeight += 1;
    }

    // Calculate activity types progress
    if (requirements.activity_types) {
      let activityProgress = 0;
      let activityCount = 0;
      
      for (const [activityType, requiredCount] of Object.entries(requirements.activity_types)) {
        const activityCountForType = activities.filter(a => a.activity_type === activityType).length;
        const typeProgress = Math.min((activityCountForType / (requiredCount as number)) * 100, 100);
        activityProgress += typeProgress;
        activityCount++;
      }
      
      if (activityCount > 0) {
        progress += activityProgress / activityCount;
        totalWeight += 1;
      }
    }

    // Return average progress if we have requirements
    return totalWeight > 0 ? Math.round(progress / totalWeight) : 0;
  }

  /**
   * Calculate consecutive days of activity
   */
  private static calculateConsecutiveDays(activities: any[]): number {
    if (activities.length === 0) return 0;

    const activityDates = activities
      .map(a => new Date(a.created_at).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort()
      .reverse();

    let consecutiveDays = 1;
    for (let i = 0; i < activityDates.length - 1; i++) {
      const currentDate = new Date(activityDates[i]);
      const nextDate = new Date(activityDates[i + 1]);
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        consecutiveDays++;
      } else {
        break;
      }
    }

    return consecutiveDays;
  }

  /**
   * Get achievement statistics
   */
  static async getAchievementStats(studentId: string): Promise<AchievementStats> {
    try {
      const { data: achievements } = await this.getAchievements();
      const { data: studentAchievements } = await this.getStudentAchievements(studentId);

      const totalAchievements = achievements?.length || 0;
      const unlockedAchievements = studentAchievements?.filter(sa => sa.is_unlocked).length || 0;
      const totalPoints = studentAchievements
        ?.filter(sa => sa.is_unlocked)
        .reduce((sum, sa) => sum + (sa.achievement?.points || 0), 0) || 0;

      const achievementsByRarity = {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      };

      studentAchievements?.forEach(sa => {
        if (sa.is_unlocked && sa.achievement) {
          achievementsByRarity[sa.achievement.rarity as keyof typeof achievementsByRarity]++;
        }
      });

      return {
        totalAchievements,
        unlockedAchievements,
        totalPoints,
        achievementsByRarity
      };
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      return {
        totalAchievements: 0,
        unlockedAchievements: 0,
        totalPoints: 0,
        achievementsByRarity: {
          common: 0,
          rare: 0,
          epic: 0,
          legendary: 0
        }
      };
    }
  }

  /**
   * Create notification
   */
  private static async createNotification(
    studentId: string,
    notification: {
      title: string;
      message: string;
      type: string;
      action_url?: string;
    }
  ): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          student_id: studentId,
          ...notification
        });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  /**
   * Log activity
   */
  private static async logActivity(
    studentId: string,
    activityType: string,
    metadata: any,
    points: number = 0
  ): Promise<void> {
    try {
      await supabase
        .from('activities')
        .insert({
          student_id: studentId,
          activity_type: activityType,
          points_earned: points,
          metadata: metadata,
          description: this.getActivityDescription(activityType, metadata)
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Get activity description
   */
  private static getActivityDescription(activityType: string, metadata: any): string {
    switch (activityType) {
      case 'achievement_unlocked':
        return `Unlocked achievement: ${metadata.achievement_name}`;
      default:
        return `Activity: ${activityType}`;
    }
  }
}
