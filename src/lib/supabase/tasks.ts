// src/lib/supabase/tasks.ts
import { supabase } from '../supabase';
import { 
  RealTimeTask, 
  StudentTaskSubmission, 
  QueryResult, 
  QueryResultArray,
  RealTimeTaskWithSubmission,
  StudentTaskSubmissionWithDetails,
  TaskStats
} from './types';

export class TaskService {
  /**
   * Get all active real-time tasks
   */
  static async getTasks(): Promise<QueryResultArray<RealTimeTask>> {
    try {
      const { data, error } = await supabase
        .from('real_time_tasks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get a specific task by ID
   */
  static async getTaskById(id: number): Promise<QueryResult<RealTimeTask>> {
    try {
      const { data, error } = await supabase
        .from('real_time_tasks')
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
   * Get student's submissions for a specific task
   */
  static async getTaskSubmission(studentId: string, taskId: number): Promise<QueryResult<StudentTaskSubmission>> {
    try {
      const { data, error } = await supabase
        .from('student_task_submissions')
        .select('*')
        .eq('student_id', studentId)
        .eq('task_id', taskId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get all submissions for a student
   */
  static async getStudentSubmissions(studentId: string): Promise<QueryResultArray<StudentTaskSubmissionWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('student_task_submissions')
        .select(`
          *,
          real_time_tasks (
            title,
            category,
            points
          )
        `)
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Upload file to Supabase Storage
   */
  static async uploadFile(
    file: File,
    bucket: string = 'task-submissions',
    path: string
  ): Promise<{ data: { path: string; fullPath: string } | null; error: any }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { data: null, error };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        data: {
          path: filePath,
          fullPath: urlData.publicUrl
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Submit a task
   */
  static async submitTask(
    studentId: string,
    taskId: number,
    submissionType: 'image' | 'video' | 'text' | 'document',
    submissionData: any,
    file?: File
  ): Promise<QueryResult<StudentTaskSubmission>> {
    try {
      let fileUrl = '';
      let fileName = '';
      let fileSize = 0;

      // Upload file if provided
      if (file) {
        const uploadResult = await this.uploadFile(file, 'task-submissions', `task-${taskId}`);
        if (uploadResult.error) {
          return { data: null, error: uploadResult.error };
        }
        fileUrl = uploadResult.data!.fullPath;
        fileName = file.name;
        fileSize = file.size;
      }

      // Prepare submission data
      const submissionPayload: Omit<StudentTaskSubmission, 'id'> = {
        student_id: studentId,
        task_id: taskId,
        submission_type: submissionType,
        submission_data: {
          file_url: fileUrl,
          text_content: submissionData.text_content,
          file_name: fileName,
          file_size: fileSize
        },
        status: 'pending', // Pending approval
        points_earned: 0, // Points awarded only after approval
        submitted_at: new Date().toISOString()
      };

      // Check if submission already exists
      const { data: existingSubmission } = await this.getTaskSubmission(studentId, taskId);

      let result;
      if (existingSubmission) {
        // Update existing submission
        const { data, error } = await supabase
          .from('student_task_submissions')
          .update(submissionPayload)
          .eq('student_id', studentId)
          .eq('task_id', taskId)
          .select()
          .single();

        result = { data, error };
      } else {
        // Create new submission
        const { data, error } = await supabase
          .from('student_task_submissions')
          .insert(submissionPayload)
          .select()
          .single();

        result = { data, error };
      }

      // Award points and log activity if submission was successful
      if (result.data && !result.error) {
        // Get task details to determine points
        const { data: taskData } = await this.getTaskById(taskId);
        const taskPoints = taskData?.points || 0;

        // Award points for task submission
        await this.logActivity(studentId, 'task_submitted', {
          task_id: taskId,
          submission_type: submissionType,
          points_earned: taskPoints
        }, taskPoints);

        // Update submission with points earned
        await supabase
          .from('student_task_submissions')
          .update({ points_earned: taskPoints })
          .eq('id', result.data.id);

        // Update user's total points
        if (taskPoints > 0) {
          await this.updateUserPoints(studentId, taskPoints);
        }
      }

      return result;
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get task statistics
   */
  static async getTaskStats(taskId: number): Promise<TaskStats> {
    try {
      const { data, error } = await supabase
        .from('student_task_submissions')
        .select('status, points_earned')
        .eq('task_id', taskId);

      if (error) {
        return {
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          totalPoints: 0,
          averageScore: 0
        };
      }

      const totalTasks = data?.length || 0;
      const completedTasks = data?.filter(s => s.status === 'approved').length || 0;
      const pendingTasks = data?.filter(s => s.status === 'pending').length || 0;
      const totalPoints = data?.reduce((sum, s) => sum + (s.points_earned || 0), 0) || 0;
      const averageScore = data?.length > 0 
        ? data.reduce((sum, s) => sum + (s.points_earned || 0), 0) / data.length 
        : 0;

      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        totalPoints,
        averageScore: Math.round(averageScore)
      };
    } catch (error) {
      console.error('Error getting task stats:', error);
      return {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalPoints: 0,
        averageScore: 0
      };
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

        // Update leaderboard using the proper service method
        const { LeaderboardService } = await import('./leaderboard');
        await LeaderboardService.updateLeaderboard(studentId, points);
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
      case 'task_submitted':
        return `Submitted task: ${metadata.task_id}`;
      default:
        return `Activity: ${activityType}`;
    }
  }

  /**
   * Delete a task submission
   */
  static async deleteSubmission(studentId: string, taskId: number): Promise<{ success: boolean; error?: any }> {
    try {
      // First get the submission to check if it has a file to delete
      const { data: submission } = await this.getTaskSubmission(studentId, taskId);
      
      if (submission?.submission_data?.file_url) {
        // Delete the file from storage
        const fileName = submission.submission_data.file_url.split('/').pop();
        if (fileName) {
          const { error: deleteError } = await supabase.storage
            .from('task-submissions')
            .remove([`task-${taskId}/${fileName}`]);
          
          if (deleteError) {
            console.error('Error deleting file from storage:', deleteError);
          }
        }
      }

      // Delete the submission record
      const { error } = await supabase
        .from('student_task_submissions')
        .delete()
        .eq('student_id', studentId)
        .eq('task_id', taskId);

      if (error) {
        console.error('Error deleting submission:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting submission:', error);
      return { success: false, error };
    }
  }
}
