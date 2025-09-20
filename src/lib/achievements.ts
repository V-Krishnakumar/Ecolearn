import { getAchievements } from '@/data/achievements';
import { Achievement, AchievementStats, UserAchievement } from '@/types/achievements';

export class AchievementManager {
  private static readonly STORAGE_KEY = 'ecolearn_achievements';

  /**
   * Get user's achievements
   */
  static getUserAchievements(userId: string, t: (key: string) => string): Achievement[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const userAchievements: Record<string, Achievement[]> = JSON.parse(stored);
        const storedAchievements = userAchievements[userId];
        if (storedAchievements) {
          // Apply translations to stored achievements
          return this.applyTranslationsToStoredAchievements(storedAchievements, t);
        }
        return this.initializeAchievements(t);
      }
      return this.initializeAchievements(t);
    } catch (error) {
      console.error('Error getting achievements:', error);
      return this.initializeAchievements(t);
    }
  }

  /**
   * Update achievement progress
   */
  static updateAchievementProgress(
    userId: string, 
    type: string, 
    increment: number = 1,
    t: (key: string) => string
  ): Achievement[] {
    const achievements = this.getUserAchievements(userId, t);
    const updatedAchievements = achievements.map(achievement => {
      const requirement = achievement.requirements.find(req => req.type === type);
      if (requirement) {
        const newCurrent = Math.min(requirement.current + increment, requirement.target);
        requirement.current = newCurrent;
        achievement.progress = (newCurrent / requirement.target) * 100;
        
        // Check if achievement is unlocked
        if (newCurrent >= requirement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date().toISOString();
        }
      }
      return achievement;
    });

    this.saveUserAchievements(userId, updatedAchievements);
    return updatedAchievements;
  }

  /**
   * Check for newly unlocked achievements
   */
  static checkNewAchievements(userId: string, t: (key: string) => string): Achievement[] {
    const achievements = this.getUserAchievements(userId, t);
    const now = Date.now();
    
    return achievements.filter(achievement => 
      achievement.unlockedAt && 
      new Date(achievement.unlockedAt).getTime() > now - 10000 // Last 10 seconds
    );
  }

  /**
   * Get achievement statistics
   */
  static getAchievementStats(userId: string, t: (key: string) => string): AchievementStats {
    const achievements = this.getUserAchievements(userId, t);
    const unlockedAchievements = achievements.filter(a => a.unlockedAt);
    
    const achievementsByCategory = achievements.reduce((acc, achievement) => {
      if (achievement.unlockedAt) {
        acc[achievement.category] = (acc[achievement.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const recentAchievements = unlockedAchievements
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 5);

    return {
      totalAchievements: achievements.length,
      unlockedAchievements: unlockedAchievements.length,
      totalPoints: unlockedAchievements.reduce((sum, a) => sum + a.points, 0),
      achievementsByCategory,
      recentAchievements
    };
  }

  /**
   * Reset all achievements for a user
   */
  static resetAchievements(userId: string): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const allAchievements: Record<string, Achievement[]> = JSON.parse(stored);
        delete allAchievements[userId];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allAchievements));
      }
    } catch (error) {
      console.error('Error resetting achievements:', error);
    }
  }

  /**
   * Get achievements by category
   */
  static getAchievementsByCategory(userId: string, category: string, t: (key: string) => string): Achievement[] {
    const achievements = this.getUserAchievements(userId, t);
    return achievements.filter(achievement => achievement.category === category);
  }

  /**
   * Get achievements by rarity
   */
  static getAchievementsByRarity(userId: string, rarity: string, t: (key: string) => string): Achievement[] {
    const achievements = this.getUserAchievements(userId, t);
    return achievements.filter(achievement => achievement.rarity === rarity);
  }

  /**
   * Get unlocked achievements
   */
  static getUnlockedAchievements(userId: string, t: (key: string) => string): Achievement[] {
    const achievements = this.getUserAchievements(userId, t);
    return achievements.filter(achievement => achievement.unlockedAt);
  }

  /**
   * Get locked achievements
   */
  static getLockedAchievements(userId: string, t: (key: string) => string): Achievement[] {
    const achievements = this.getUserAchievements(userId, t);
    return achievements.filter(achievement => !achievement.unlockedAt);
  }

  /**
   * Apply translations to stored achievements
   */
  private static applyTranslationsToStoredAchievements(storedAchievements: Achievement[], t: (key: string) => string): Achievement[] {
    const freshAchievements = getAchievements(t);
    
    return storedAchievements.map(storedAchievement => {
      // Find the corresponding fresh achievement with translations
      const freshAchievement = freshAchievements.find(fresh => fresh.id === storedAchievement.id);
      
      if (freshAchievement) {
        // Keep the stored progress and status, but use fresh translations
        return {
          ...storedAchievement,
          title: freshAchievement.title,
          description: freshAchievement.description,
          requirements: storedAchievement.requirements.map(req => ({
            ...req,
            description: freshAchievement.requirements.find(freshReq => freshReq.type === req.type)?.description || req.description
          }))
        };
      }
      
      return storedAchievement;
    });
  }

  /**
   * Initialize achievements for a new user
   */
  private static initializeAchievements(t: (key: string) => string): Achievement[] {
    return getAchievements(t).map(achievement => ({ 
      ...achievement,
      requirements: achievement.requirements.map(req => ({ ...req }))
    }));
  }

  /**
   * Save user achievements to localStorage
   */
  private static saveUserAchievements(userId: string, achievements: Achievement[]): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const allAchievements = stored ? JSON.parse(stored) : {};
      allAchievements[userId] = achievements;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allAchievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  /**
   * Update specific achievement requirement
   */
  static updateSpecificAchievement(
    userId: string, 
    achievementId: string, 
    requirementType: string, 
    increment: number = 1,
    t: (key: string) => string
  ): Achievement[] {
    const achievements = this.getUserAchievements(userId, t);
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.id === achievementId) {
        const requirement = achievement.requirements.find(req => req.type === requirementType);
        if (requirement) {
          const newCurrent = Math.min(requirement.current + increment, requirement.target);
          requirement.current = newCurrent;
          achievement.progress = (newCurrent / requirement.target) * 100;
          
          // Check if achievement is unlocked
          if (newCurrent >= requirement.target && !achievement.unlockedAt) {
            achievement.unlockedAt = new Date().toISOString();
          }
        }
      }
      return achievement;
    });

    this.saveUserAchievements(userId, updatedAchievements);
    return updatedAchievements;
  }
}
