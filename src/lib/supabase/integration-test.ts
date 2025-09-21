// src/lib/supabase/integration-test.ts
// Integration test to verify all Supabase services work correctly with the SQL schema

import { supabase } from '../supabase';
import { AchievementService } from './achievements';
import { LessonService } from './lessons';
import { TaskService } from './tasks';
import { LeaderboardService } from './leaderboard';
import { NotificationService } from './notifications';
import { QuizService } from './quizzes';

export class IntegrationTest {
  private testUserId: string = 'test-user-' + Date.now();

  /**
   * Run all integration tests
   */
  static async runAllTests(): Promise<{
    success: boolean;
    results: Record<string, { success: boolean; error?: string }>;
  }> {
    const test = new IntegrationTest();
    const results: Record<string, { success: boolean; error?: string }> = {};

    // Test each service
    results.profiles = await test.testProfiles();
    results.achievements = await test.testAchievements();
    results.lessons = await test.testLessons();
    results.quizzes = await test.testQuizzes();
    results.tasks = await test.testTasks();
    results.leaderboard = await test.testLeaderboard();
    results.notifications = await test.testNotifications();
    results.activities = await test.testActivities();

    const allSuccess = Object.values(results).every(result => result.success);

    return {
      success: allSuccess,
      results
    };
  }

  /**
   * Test profile operations
   */
  private async testProfiles(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test profile creation
      const { data: profile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: this.testUserId,
          username: 'Test User',
          email: 'test@example.com',
          role: 'student',
          total_points: 0,
          level: 1
        })
        .select()
        .single();

      if (createError) {
        return { success: false, error: createError.message };
      }

      // Test profile fetch
      const { data: fetchedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.testUserId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Test profile update
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ total_points: 100 })
        .eq('id', this.testUserId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Cleanup
      await supabase.from('profiles').delete().eq('id', this.testUserId);

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Test achievement operations
   */
  private async testAchievements(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test getting achievements
      const { data: achievements, error: getError } = await AchievementService.getAchievements();
      
      if (getError) {
        return { success: false, error: getError.message };
      }

      // Test getting student achievements
      const { data: studentAchievements, error: studentError } = await AchievementService.getStudentAchievements(this.testUserId);
      
      if (studentError) {
        return { success: false, error: studentError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Test lesson operations
   */
  private async testLessons(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test getting lessons
      const { data: lessons, error: getError } = await LessonService.getLessons();
      
      if (getError) {
        return { success: false, error: getError.message };
      }

      // Test getting student progress
      const { data: progress, error: progressError } = await LessonService.getStudentProgress(this.testUserId);
      
      if (progressError) {
        return { success: false, error: progressError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Test quiz operations
   */
  private async testQuizzes(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test getting quizzes (if any exist)
      const { data: quizzes, error: getError } = await supabase
        .from('quizzes')
        .select('*')
        .limit(1);

      if (getError) {
        return { success: false, error: getError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Test task operations
   */
  private async testTasks(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test getting tasks
      const { data: tasks, error: getError } = await TaskService.getTasks();
      
      if (getError) {
        return { success: false, error: getError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Test leaderboard operations
   */
  private async testLeaderboard(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test getting leaderboard
      const { data: leaderboard, error: getError } = await LeaderboardService.getLeaderboard();
      
      if (getError) {
        return { success: false, error: getError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Test notification operations
   */
  private async testNotifications(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test getting notifications
      const { data: notifications, error: getError } = await NotificationService.getNotifications(this.testUserId);
      
      if (getError) {
        return { success: false, error: getError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Test activity operations
   */
  private async testActivities(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test getting activities
      const { data: activities, error: getError } = await supabase
        .from('activities')
        .select('*')
        .eq('student_id', this.testUserId)
        .limit(1);

      if (getError) {
        return { success: false, error: getError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export a simple test runner
export async function runIntegrationTest(): Promise<void> {
  console.log('🧪 Running Supabase integration tests...');
  
  const results = await IntegrationTest.runAllTests();
  
  console.log('📊 Test Results:');
  Object.entries(results.results).forEach(([service, result]) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${service}: ${result.success ? 'PASS' : result.error}`);
  });
  
  if (results.success) {
    console.log('🎉 All tests passed! Integration is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
  }
}
