export interface AchievementRequirement {
  type: 'lessons_completed' | 'games_won' | 'quiz_perfect' | 'streak_days' | 'points_earned' | 'environmental_actions' | 'video_watched' | 'certificate_earned';
  target: number;
  current: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'environmental' | 'social' | 'streak' | 'special' | 'games';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: AchievementRequirement[];
  unlockedAt?: string;
  progress: number; // 0-100
  color: string; // For UI theming
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  progress: number;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  achievementsByCategory: Record<string, number>;
  recentAchievements: Achievement[];
}
