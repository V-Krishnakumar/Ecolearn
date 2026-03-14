// src/lib/supabase/types.ts
// TypeScript types that match the SQL schema exactly

export type UserRole = 'platform_admin' | 'school_admin' | 'teacher' | 'student' | 'independent_student';

export interface Profile {
  id: string; // UUID
  school_id?: string; // UUID
  username?: string;
  created_at: string;
  email: string;
  role: UserRole;
  updated_at: string;
  avatar_url?: string;
  bio?: string;
  total_points: number;
  level: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon?: string;
  points: number;
  category?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements?: any; // JSONB
  is_active: boolean;
  created_at: string;
}

export interface Activity {
  id: number; // bigint GENERATED ALWAYS AS IDENTITY
  school_id?: string; // UUID
  student_id?: string; // UUID
  type?: string;
  points?: number;
  created_at: string;
  activity_type?: string;
  points_earned: number;
  description?: string;
  metadata?: any; // JSONB
}

export interface Leaderboard {
  id: number; // bigint GENERATED ALWAYS AS IDENTITY
  school_id?: string; // UUID
  student_id?: string; // UUID
  points: number;
  updated_at: string;
  total_points: number;
  weekly_points: number;
  monthly_points: number;
  rank_position?: number;
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  school_id?: string; // UUID
  student_id?: string; // UUID
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Quiz {
  id: number;
  lesson_id?: number;
  question: string;
  options: any; // JSONB
  correct_answer: number;
  explanation?: string;
  points: number;
  created_at: string;
}

export interface RealTimeTask {
  id: number;
  title: string;
  description: string;
  instructions?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  time_estimate_minutes: number;
  max_participants?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentAchievement {
  id: number;
  school_id?: string; // UUID
  student_id?: string; // UUID
  achievement_id?: number;
  progress: number; // 0-100
  is_unlocked: boolean;
  unlocked_at?: string;
  created_at: string;
}

export interface StudentLessonProgress {
  id?: number;
  school_id?: string; // UUID
  student_id?: string; // UUID
  lesson_id?: number;
  video_progress: number; // 0-100
  game_completed: boolean;
  quiz_completed: boolean;
  quiz_score: number; // 0-100
  is_completed: boolean;
  time_spent_minutes: number;
  last_accessed: string;
  completed_at?: string;
  points?: number; // Points earned for this lesson
  created_at?: string;
  updated_at?: string;
}

export interface StudentQuizAttempt {
  id: number;
  school_id?: string; // UUID
  student_id?: string; // UUID
  quiz_id?: number;
  selected_answer: number;
  is_correct: boolean;
  points_earned: number;
  attempted_at: string;
}

export interface StudentTaskSubmission {
  id: number;
  school_id?: string; // UUID
  student_id?: string; // UUID
  task_id?: number;
  submission_type: 'image' | 'video' | 'text' | 'document';
  submission_data: any; // JSONB
  status: 'pending' | 'approved' | 'rejected';
  points_earned: number;
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string; // UUID
}

// Extended types with relationships for queries
export interface ProfileWithStats extends Profile {
  achievements?: StudentAchievement[];
  activities?: Activity[];
  leaderboard?: Leaderboard;
  lesson_progress?: StudentLessonProgress[];
  notifications?: Notification[];
}

export interface AchievementWithProgress extends Achievement {
  student_progress?: StudentAchievement;
}

export interface LessonWithProgress extends Lesson {
  student_progress?: StudentLessonProgress;
  quizzes?: Quiz[];
}

export interface RealTimeTaskWithSubmission extends RealTimeTask {
  student_submission?: StudentTaskSubmission;
}

export interface StudentAchievementWithDetails extends StudentAchievement {
  achievement?: Achievement;
}

export interface StudentLessonProgressWithDetails extends StudentLessonProgress {
  lesson?: Lesson;
}

export interface StudentQuizAttemptWithDetails extends StudentQuizAttempt {
  quiz?: Quiz;
}

export interface StudentTaskSubmissionWithDetails extends StudentTaskSubmission {
  real_time_task?: RealTimeTask;
  reviewed_by_profile?: Profile;
}

// Query result types
export interface QueryResult<T> {
  data: T | null;
  error: any;
}

export interface QueryResultArray<T> {
  data: T[] | null;
  error: any;
}

// Statistics types
export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  achievementsByRarity: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  recentAchievements?: Achievement[];
}

export interface LessonStats {
  totalLessons: number;
  completedLessons: number;
  totalPoints: number;
  averageScore: number;
  progressByCategory: Record<string, number>;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalPoints: number;
  averageScore: number;
}

export interface LeaderboardStats {
  totalParticipants: number;
  userRank: number;
  total_points: number;
  topParticipants: Array<{
    id: string;
    username: string;
    points: number;
    rank: number;
  }>;
}

// Activity types
export type ActivityType = 
  | 'lesson_completed'
  | 'quiz_completed'
  | 'game_completed'
  | 'achievement_unlocked'
  | 'task_submitted'
  | 'video_watched'
  | 'login'
  | 'profile_updated';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement';

// Difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Rarity levels
export type RarityLevel = 'common' | 'rare' | 'epic' | 'legendary';

// Submission types
export type SubmissionType = 'image' | 'video' | 'text' | 'document';

// Submission status
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

// User roles
