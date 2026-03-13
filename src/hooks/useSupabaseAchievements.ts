// src/hooks/useSupabaseAchievements.ts
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { AchievementService, Achievement, StudentAchievement, AchievementStats } from '@/lib/supabase/achievements';

export function useSupabaseAchievements() {
  const { user } = useUser();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalPoints: 0,
    achievementsByRarity: {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const loadAchievements = async () => {
    if (user) {
      try {
        setLoading(true);
        
        // Load all achievements
        const { data: allAchievements, error: achievementsError } = await AchievementService.getAchievements();
        console.log('Achievements loaded:', allAchievements, 'Error:', achievementsError);
        if (achievementsError) {
          console.error('Error loading achievements:', achievementsError);
        } else {
          setAchievements(allAchievements || []);
        }

        // Load student achievements
        const { data: studentAchievementsData, error: studentError } = await AchievementService.getStudentAchievements(user.id);
        if (studentError) {
          console.error('Error loading student achievements:', studentError);
        } else {
          setStudentAchievements(studentAchievementsData || []);
        }

        // Load stats
        const statsData = await AchievementService.getAchievementStats(user.id);
        setStats(statsData);

        // Check for new achievements
        const { newAchievements: newAchievementsData } = await AchievementService.checkAchievements(user.id);
        if (newAchievementsData && newAchievementsData.length > 0) {
          setNewAchievements(newAchievementsData);
          // Refresh data to get new achievements
          await loadAchievements();
        } else {
          setNewAchievements([]);
        }

      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const getUnlockedAchievements = (): StudentAchievement[] => {
    return studentAchievements.filter(sa => sa.is_unlocked);
  };

  const getRecentAchievements = (): StudentAchievement[] => {
    return studentAchievements
      .filter(sa => sa.is_unlocked && sa.unlocked_at)
      .sort((a, b) => new Date(b.unlocked_at!).getTime() - new Date(a.unlocked_at!).getTime())
      .slice(0, 5);
  };

  const getAchievementProgress = (achievementId: number): number => {
    const studentAchievement = studentAchievements.find(sa => sa.achievement_id === achievementId);
    return studentAchievement?.progress || 0;
  };

  const isAchievementUnlocked = (achievementId: number): boolean => {
    const studentAchievement = studentAchievements.find(sa => sa.achievement_id === achievementId);
    return studentAchievement?.is_unlocked || false;
  };

  const getAchievementsByRarity = (rarity: 'common' | 'rare' | 'epic' | 'legendary'): StudentAchievement[] => {
    return studentAchievements.filter(sa => 
      sa.is_unlocked && sa.achievement?.rarity === rarity
    );
  };

  const getAchievementsByCategory = (category: string): Achievement[] => {
    return achievements.filter(achievement => achievement.category === category);
  };

  const getLockedAchievements = (): StudentAchievement[] => {
    return studentAchievements.filter(sa => !sa.is_unlocked);
  };

  const getAchievementById = (achievementId: number): Achievement | undefined => {
    return achievements.find(a => a.id === achievementId);
  };

  const getStudentAchievementById = (achievementId: number): StudentAchievement | undefined => {
    return studentAchievements.find(sa => sa.achievement_id === achievementId);
  };

  const refreshAchievements = async () => {
    await loadAchievements();
  };

  const checkForNewAchievements = async () => {
    if (user) {
      const { newAchievements: newAchievementsData } = await AchievementService.checkAchievements(user.id);
      if (newAchievementsData && newAchievementsData.length > 0) {
        setNewAchievements(newAchievementsData);
        return newAchievementsData;
      }
    }
    return [];
  };

  const dismissNotification = (achievementId: number) => {
    setNewAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
  };

  return {
    achievements,
    studentAchievements,
    newAchievements,
    stats,
    loading,
    getUnlockedAchievements,
    getRecentAchievements,
    getAchievementProgress,
    isAchievementUnlocked,
    getAchievementsByRarity,
    getAchievementsByCategory,
    getLockedAchievements,
    getAchievementById,
    getStudentAchievementById,
    refreshAchievements,
    checkForNewAchievements,
    dismissNotification
  };
}
