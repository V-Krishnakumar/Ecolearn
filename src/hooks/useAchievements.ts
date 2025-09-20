import { useState, useEffect, useCallback } from 'react';
import { AchievementManager } from '@/lib/achievements';
import { Achievement, AchievementStats } from '@/types/achievements';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function useAchievements() {
  const { user } = useUser();
  const { t } = useLanguage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalPoints: 0,
    achievementsByCategory: {},
    recentAchievements: []
  });
  const [loading, setLoading] = useState(true);

  // Load achievements for the current user
  const loadAchievements = useCallback(() => {
    if (!user) {
      setAchievements([]);
      setStats({
        totalAchievements: 0,
        unlockedAchievements: 0,
        totalPoints: 0,
        achievementsByCategory: {},
        recentAchievements: []
      });
      setLoading(false);
      return;
    }

    try {
      const userAchievements = AchievementManager.getUserAchievements(user.id, t);
      const achievementStats = AchievementManager.getAchievementStats(user.id, t);
      
      setAchievements(userAchievements);
      setStats(achievementStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading achievements:', error);
      setLoading(false);
    }
  }, [user, t]);

  // Update achievement progress
  const updateProgress = useCallback((type: string, increment: number = 1) => {
    if (!user) return;
    
    try {
      const updatedAchievements = AchievementManager.updateAchievementProgress(user.id, type, increment, t);
      setAchievements(updatedAchievements);
      
      // Update stats
      const newStats = AchievementManager.getAchievementStats(user.id, t);
      setStats(newStats);
      
      // Check for new achievements
      const newUnlocked = AchievementManager.checkNewAchievements(user.id, t);
      if (newUnlocked.length > 0) {
        setNewAchievements(prev => [...prev, ...newUnlocked]);
      }
    } catch (error) {
      console.error('Error updating achievement progress:', error);
    }
  }, [user]);

  // Update specific achievement
  const updateSpecificAchievement = useCallback((
    achievementId: string, 
    requirementType: string, 
    increment: number = 1
  ) => {
    if (!user) return;
    
    try {
      const updatedAchievements = AchievementManager.updateSpecificAchievement(
        user.id, 
        achievementId, 
        requirementType, 
        increment,
        t
      );
      setAchievements(updatedAchievements);
      
      // Update stats
      const newStats = AchievementManager.getAchievementStats(user.id, t);
      setStats(newStats);
      
      // Check for new achievements
      const newUnlocked = AchievementManager.checkNewAchievements(user.id, t);
      if (newUnlocked.length > 0) {
        setNewAchievements(prev => [...prev, ...newUnlocked]);
      }
    } catch (error) {
      console.error('Error updating specific achievement:', error);
    }
  }, [user]);

  // Dismiss notification
  const dismissNotification = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
  }, []);

  // Dismiss all notifications
  const dismissAllNotifications = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // Mark achievement as seen (alias for dismissNotification)
  const markAchievementAsSeen = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
  }, []);

  // Get achievements by category
  const getAchievementsByCategory = useCallback((category: string) => {
    return achievements.filter(achievement => achievement.category === category);
  }, [achievements]);

  // Get achievements by rarity
  const getAchievementsByRarity = useCallback((rarity: string) => {
    return achievements.filter(achievement => achievement.rarity === rarity);
  }, [achievements]);

  // Get unlocked achievements
  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(achievement => achievement.unlockedAt);
  }, [achievements]);

  // Get locked achievements
  const getLockedAchievements = useCallback(() => {
    return achievements.filter(achievement => !achievement.unlockedAt);
  }, [achievements]);

  // Reset all achievements
  const resetAchievements = useCallback(() => {
    if (!user) return;
    
    try {
      AchievementManager.resetAchievements(user.id);
      loadAchievements();
    } catch (error) {
      console.error('Error resetting achievements:', error);
    }
  }, [user, loadAchievements]);

  // Load achievements on mount and when user or language changes
  useEffect(() => {
    loadAchievements();
  }, [loadAchievements, t]);

  return {
    achievements,
    newAchievements,
    stats,
    loading,
    updateProgress,
    updateSpecificAchievement,
    dismissNotification,
    dismissAllNotifications,
    markAchievementAsSeen,
    getAchievementsByCategory,
    getAchievementsByRarity,
    getUnlockedAchievements,
    getLockedAchievements,
    resetAchievements,
    refresh: loadAchievements
  };
}
