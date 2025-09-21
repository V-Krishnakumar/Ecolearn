// src/lib/supabase/notifications.ts
import { supabase } from '../supabase';
import { 
  Notification, 
  QueryResult, 
  QueryResultArray,
  NotificationType
} from './types';

export class NotificationService {
  /**
   * Get notifications for a student
   */
  static async getNotifications(
    studentId: string, 
    limit: number = 50
  ): Promise<QueryResultArray<Notification>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get unread notifications for a student
   */
  static async getUnreadNotifications(
    studentId: string, 
    limit: number = 20
  ): Promise<QueryResultArray<Notification>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(
    studentId: string,
    notification: {
      title: string;
      message: string;
      type: NotificationType;
      action_url?: string;
    }
  ): Promise<QueryResult<Notification>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          student_id: studentId,
          ...notification,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: number): Promise<QueryResult<Notification>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Mark all notifications as read for a student
   */
  static async markAllAsRead(studentId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('student_id', studentId)
        .eq('is_read', false);

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: number): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Delete old notifications (older than 30 days)
   */
  static async deleteOldNotifications(studentId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('student_id', studentId)
        .lt('created_at', thirtyDaysAgo.toISOString());

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Get notification count for a student
   */
  static async getNotificationCount(studentId: string): Promise<{
    total: number;
    unread: number;
  }> {
    try {
      const { count: total } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId);

      const { count: unread } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('is_read', false);

      return {
        total: total || 0,
        unread: unread || 0
      };
    } catch (error) {
      console.error('Error getting notification count:', error);
      return { total: 0, unread: 0 };
    }
  }

  /**
   * Create achievement notification
   */
  static async createAchievementNotification(
    studentId: string,
    achievementName: string,
    points: number
  ): Promise<QueryResult<Notification>> {
    return this.createNotification(studentId, {
      title: 'Achievement Unlocked! 🎉',
      message: `You unlocked: ${achievementName} (+${points} points)`,
      type: 'achievement',
      action_url: '/achievements'
    });
  }

  /**
   * Create lesson completion notification
   */
  static async createLessonCompletionNotification(
    studentId: string,
    lessonTitle: string,
    points: number
  ): Promise<QueryResult<Notification>> {
    return this.createNotification(studentId, {
      title: 'Lesson Completed! ✅',
      message: `Great job completing "${lessonTitle}" (+${points} points)`,
      type: 'success',
      action_url: '/lessons'
    });
  }

  /**
   * Create task submission notification
   */
  static async createTaskSubmissionNotification(
    studentId: string,
    taskTitle: string
  ): Promise<QueryResult<Notification>> {
    return this.createNotification(studentId, {
      title: 'Task Submitted! 📝',
      message: `Your submission for "${taskTitle}" has been received and is under review`,
      type: 'info',
      action_url: '/tasks'
    });
  }
}