import { supabase } from "../supabase";
import { LeaderboardService } from './leaderboard';

export type UserStats = {
  totalPoints: number;
  lessonsCompleted: number;
  completionRate: number;
  studyStreak: number;
  averageQuizScore: number;
  favoriteTopic: string | null;
  timeSpent: number;
  nextGoal: number;
};

export type WeeklyProgress = {
  day: string;
  lessons: number;
  progress: number;
};

// -------------------------------
// Helper Functions
// -------------------------------

// Update leaderboard when points are added
async function updateLeaderboard(studentId: string, points: number) {
  if (!points || points <= 0) return;

  // Use the proper LeaderboardService method
  const { error } = await LeaderboardService.updateLeaderboard(studentId, points);
  
  if (error) {
    console.error("Leaderboard update error:", error);
  }
}

// Compute streak based on distinct activity days
function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = dates.map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diffDays =
      (sorted[i - 1].getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
}

// Next achievement milestone
function getNextGoal(points: number): number {
  const milestones = [1000, 5000, 10000, 20000];
  return milestones.find((m) => points < m) || milestones[milestones.length - 1];
}

// -------------------------------
// Main Service
// -------------------------------
export const StatisticsService = {
  // Record new activity + update leaderboard
  async recordActivity(studentId: string, type: string, points: number, metadata: any = {}) {
    const { error: insertErr } = await supabase.from("activities").insert([
      {
        student_id: studentId,
        type,
        points_earned: points,
        metadata,
      },
    ]);

    if (insertErr) {
      console.error("Error recording activity:", insertErr);
      return { error: insertErr };
    }

    await updateLeaderboard(studentId, points);
    return { success: true };
  },

  // Fetch computed stats
  async getUserStats(studentId: string): Promise<UserStats> {
    const { data: activities, error: actErr } = await supabase
      .from("activities")
      .select("points_earned, metadata, created_at")
      .eq("student_id", studentId);

    if (actErr) {
      console.error("Error fetching activities:", actErr);
      return {
        totalPoints: 0,
        lessonsCompleted: 0,
        completionRate: 0,
        studyStreak: 0,
        averageQuizScore: 0,
        favoriteTopic: null,
        timeSpent: 0,
        nextGoal: 0,
      };
    }

    const totalPoints = activities?.reduce(
      (sum, a) => sum + (a.points_earned || 0),
      0
    ) || 0;

    const timeSpent = activities?.reduce(
      (sum, a) => sum + (a.metadata?.time_spent || 0),
      0
    ) || 0;

    const studyDates = activities?.map((a) => a.created_at) || [];
    const studyStreak = calculateStreak(studyDates);

    const { data: lessons, error: lessonErr } = await supabase
      .from("student_lesson_progress")
      .select("is_completed, quiz_score")
      .eq("student_id", studentId);

    if (lessonErr) console.error("Lesson fetch error:", lessonErr);

    const lessonsCompleted =
      lessons?.filter((l) => l.is_completed === true).length || 0;

    const completionRate = lessonsCompleted;

    const { data: quizzes, error: quizErr } = await supabase
      .from("student_quiz_attempts")
      .select("points_earned, quiz_id")
      .eq("student_id", studentId);

    if (quizErr) console.error("Quiz fetch error:", quizErr);

    const averageQuizScore =
      quizzes && quizzes.length > 0
        ? quizzes.reduce((sum, q) => sum + (q.points_earned || 0), 0) / quizzes.length
        : 0;

    let favoriteTopic: string | null = null;
    // For now, set a default favorite topic since we don't have topic data in student_lesson_progress
    if (lessonsCompleted > 0) {
      favoriteTopic = "Environment"; // Default topic
    }

    const nextGoal = getNextGoal(totalPoints);

    return {
      totalPoints,
      lessonsCompleted,
      completionRate,
      studyStreak,
      averageQuizScore,
      favoriteTopic,
      timeSpent,
      nextGoal,
    };
  },

  // Fetch weekly progress
  async getWeeklyProgress(studentId: string): Promise<WeeklyProgress[]> {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('student_lesson_progress')
      .select('completed_at')
      .eq('student_id', studentId)
      .eq('is_completed', true)
      .gte('completed_at', startOfWeek.toISOString());

    if (error) {
      console.error('Error fetching weekly progress:', error);
      return [];
    }

    const days: Record<string, number> = {};
    data.forEach((entry) => {
      const day = new Date(entry.completed_at).toLocaleString('en-US', { weekday: 'long' });
      days[day] = (days[day] || 0) + 1;
    });

    const maxLessonsPerDay = 10;
    return Object.entries(days).map(([day, lessons]) => ({
      day,
      lessons,
      progress: (lessons / maxLessonsPerDay) * 100,
    }));
  },

  // Fetch next achievement goal
  async getNextAchievementGoal(studentId: string) {
    const { data: unlocked, error: unlockedErr } = await supabase
      .from('student_achievements')
      .select('achievement_id')
      .eq('student_id', studentId)
      .eq('is_unlocked', true);

    if (unlockedErr) {
      console.error('Error fetching unlocked achievements:', unlockedErr);
      return null;
    }

    const unlockedIds = unlocked.map((a) => a.achievement_id);

    let query = supabase
      .from('achievements')
      .select('id, name, description, points, requirements')
      .order('points', { ascending: true })
      .limit(1);

    // Only add the NOT IN filter if there are unlocked achievements
    if (unlockedIds.length > 0) {
      query = query.not('id', 'in', `(${unlockedIds.join(',')})`);
    }

    const { data: achievements, error: achErr } = await query.single();

    if (achErr) {
      console.error('Error fetching next achievement:', achErr);
      return null;
    }

    const { data: progress, error: progErr } = await supabase
      .from('student_achievements')
      .select('progress')
      .eq('student_id', studentId)
      .eq('achievement_id', achievements.id)
      .single();

    if (progErr && progErr.code !== 'PGRST116') {
      console.error('Error fetching achievement progress:', progErr);
      return null;
    }

    return {
      achievement: achievements,
      progress: progress?.progress || 0,
      total: achievements.requirements?.total || 100,
    };
  },
};
