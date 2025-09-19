// src/lib/localProgress.ts
import { useUser } from '@/contexts/UserContext';

export interface LessonProgress {
  lessonId: number;
  videoProgress: number; // 0-100
  gameCompleted: boolean;
  quizCompleted: boolean;
  quizScore: number;
  lastAccessed: string;
  completed: boolean;
}

export interface UserProgress {
  userId: string;
  lessons: Record<number, LessonProgress>;
  totalPoints: number;
  achievements: string[];
  lastUpdated: string;
}

export class LocalProgress {
  private static readonly STORAGE_KEY = 'ecolearn_progress';

  /**
   * Get user's progress data
   */
  static getUserProgress(userId: string): UserProgress {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const allProgress: Record<string, UserProgress> = JSON.parse(stored);
        return allProgress[userId] || this.createEmptyProgress(userId);
      }
      return this.createEmptyProgress(userId);
    } catch (error) {
      console.error('Error getting user progress:', error);
      return this.createEmptyProgress(userId);
    }
  }

  /**
   * Save user's progress data
   */
  static saveUserProgress(userId: string, progress: UserProgress): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const allProgress: Record<string, UserProgress> = stored ? JSON.parse(stored) : {};
      allProgress[userId] = {
        ...progress,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  /**
   * Update lesson progress
   */
  static updateLessonProgress(
    userId: string, 
    lessonId: number, 
    updates: Partial<LessonProgress>
  ): void {
    const progress = this.getUserProgress(userId);
    
    if (!progress.lessons[lessonId]) {
      progress.lessons[lessonId] = this.createEmptyLessonProgress(lessonId);
    }

    progress.lessons[lessonId] = {
      ...progress.lessons[lessonId],
      ...updates,
      lastAccessed: new Date().toISOString()
    };

    // Update completion status
    const lesson = progress.lessons[lessonId];
    lesson.completed = lesson.videoProgress >= 100 && lesson.gameCompleted && lesson.quizCompleted;

    // Update total points
    progress.totalPoints = Object.values(progress.lessons).reduce((sum, lesson) => {
      return sum + (lesson.completed ? 100 : 0) + lesson.quizScore;
    }, 0);

    this.saveUserProgress(userId, progress);
  }

  /**
   * Get lesson progress
   */
  static getLessonProgress(userId: string, lessonId: number): LessonProgress {
    const progress = this.getUserProgress(userId);
    return progress.lessons[lessonId] || this.createEmptyLessonProgress(lessonId);
  }

  /**
   * Get overall progress percentage
   */
  static getOverallProgress(userId: string): number {
    const progress = this.getUserProgress(userId);
    const lessons = Object.values(progress.lessons);
    
    if (lessons.length === 0) return 0;
    
    const totalProgress = lessons.reduce((sum, lesson) => {
      let lessonProgress = 0;
      
      // Video progress (40% weight)
      lessonProgress += (lesson.videoProgress / 100) * 40;
      
      // Game completion (30% weight)
      if (lesson.gameCompleted) lessonProgress += 30;
      
      // Quiz completion (30% weight)
      if (lesson.quizCompleted) lessonProgress += 30;
      
      return sum + lessonProgress;
    }, 0);
    
    return totalProgress / lessons.length;
  }

  /**
   * Get completed lessons count
   */
  static getCompletedLessonsCount(userId: string): number {
    const progress = this.getUserProgress(userId);
    return Object.values(progress.lessons).filter(lesson => lesson.completed).length;
  }

  /**
   * Get total learning time (estimated)
   */
  static getTotalLearningTime(userId: string): number {
    const progress = this.getUserProgress(userId);
    const completedLessons = Object.values(progress.lessons).filter(lesson => lesson.completed).length;
    
    // Estimate 15 minutes per completed lesson
    return (completedLessons * 15) / 60; // Convert to hours
  }

  /**
   * Reset all progress for a user
   */
  static resetProgress(userId: string): void {
    const emptyProgress = this.createEmptyProgress(userId);
    this.saveUserProgress(userId, emptyProgress);
  }

  /**
   * Create empty progress for a new user
   */
  private static createEmptyProgress(userId: string): UserProgress {
    return {
      userId,
      lessons: {},
      totalPoints: 0,
      achievements: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Create empty lesson progress
   */
  private static createEmptyLessonProgress(lessonId: number): LessonProgress {
    return {
      lessonId,
      videoProgress: 0,
      gameCompleted: false,
      quizCompleted: false,
      quizScore: 0,
      lastAccessed: new Date().toISOString(),
      completed: false
    };
  }

  /**
   * Get progress for dashboard display
   */
  static getDashboardProgress(userId: string) {
    const progress = this.getUserProgress(userId);
    const lessons = Object.values(progress.lessons);
    
    return {
      overallProgress: this.getOverallProgress(userId),
      completedLessons: this.getCompletedLessonsCount(userId),
      totalLessons: 6, // Total number of lessons
      totalTime: this.getTotalLearningTime(userId),
      totalPoints: progress.totalPoints,
      lessons: lessons.map(lesson => ({
        id: lesson.lessonId,
        progress: this.calculateLessonProgress(lesson),
        completed: lesson.completed,
        videoProgress: lesson.videoProgress,
        gameCompleted: lesson.gameCompleted,
        quizCompleted: lesson.quizCompleted
      }))
    };
  }

  /**
   * Calculate individual lesson progress
   */
  private static calculateLessonProgress(lesson: LessonProgress): number {
    let progress = 0;
    
    // Video progress (40% weight)
    progress += (lesson.videoProgress / 100) * 40;
    
    // Game completion (30% weight)
    if (lesson.gameCompleted) progress += 30;
    
    // Quiz completion (30% weight)
    if (lesson.quizCompleted) progress += 30;
    
    return Math.round(progress);
  }
}

/**
 * Hook to use progress tracking
 */
export const useProgress = () => {
  const { user } = useUser();
  
  const updateLessonProgress = (lessonId: number, updates: Partial<LessonProgress>) => {
    if (!user) return;
    LocalProgress.updateLessonProgress(user.id, lessonId, updates);
  };

  const getLessonProgress = (lessonId: number): LessonProgress => {
    if (!user) return LocalProgress.createEmptyLessonProgress(lessonId);
    return LocalProgress.getLessonProgress(user.id, lessonId);
  };

  const getDashboardData = () => {
    if (!user) return null;
    return LocalProgress.getDashboardProgress(user.id);
  };

  const resetProgress = () => {
    if (!user) return;
    LocalProgress.resetProgress(user.id);
  };

  const getUserProgress = (userId: string) => {
    return LocalProgress.getUserProgress(userId);
  };

  return {
    updateLessonProgress,
    getLessonProgress,
    getDashboardData,
    getUserProgress,
    resetProgress
  };
};
