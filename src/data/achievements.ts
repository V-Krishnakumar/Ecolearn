import { Achievement } from '@/types/achievements';

export const getAchievements = (t: (key: string) => string): Achievement[] => [
  // Learning Achievements
  {
    id: 'first_lesson',
    title: t('achievement.first.steps.title'),
    description: t('achievement.first.steps.desc'),
    icon: '🌱',
    category: 'learning',
    rarity: 'common',
    points: 10,
    color: 'from-green-400 to-green-600',
    requirements: [{ 
      type: 'lessons_completed', 
      target: 1, 
      current: 0, 
      description: 'Complete 1 lesson' 
    }],
    progress: 0
  },
  {
    id: 'video_watcher',
    title: t('achievement.video.learner.title'),
    description: t('achievement.video.learner.desc'),
    icon: '📺',
    category: 'learning',
    rarity: 'common',
    points: 25,
    color: 'from-blue-400 to-blue-600',
    requirements: [{ 
      type: 'video_watched', 
      target: 5, 
      current: 0, 
      description: 'Watch 5 videos completely' 
    }],
    progress: 0
  },
  {
    id: 'quiz_master',
    title: t('achievement.quiz.master.title'),
    description: t('achievement.quiz.master.desc'),
    icon: '🧠',
    category: 'learning',
    rarity: 'rare',
    points: 50,
    color: 'from-purple-400 to-purple-600',
    requirements: [{ 
      type: 'quiz_perfect', 
      target: 5, 
      current: 0, 
      description: 'Get 100% on 5 quizzes' 
    }],
    progress: 0
  },
  {
    id: 'knowledge_seeker',
    title: t('achievement.knowledge.seeker.title'),
    description: t('achievement.knowledge.seeker.desc'),
    icon: '📚',
    category: 'learning',
    rarity: 'rare',
    points: 75,
    color: 'from-indigo-400 to-indigo-600',
    requirements: [{ 
      type: 'lessons_completed', 
      target: 10, 
      current: 0, 
      description: 'Complete 10 lessons' 
    }],
    progress: 0
  },

  // Environmental Achievements
  {
    id: 'tree_warrior',
    title: t('achievement.tree.warrior.title'),
    description: t('achievement.tree.warrior.desc'),
    icon: '🌳',
    category: 'environmental',
    rarity: 'epic',
    points: 100,
    color: 'from-green-500 to-emerald-600',
    requirements: [{ 
      type: 'environmental_actions', 
      target: 5, 
      current: 0, 
      description: 'Complete 5 tree planting activities' 
    }],
    progress: 0
  },
  {
    id: 'water_guardian',
    title: t('achievement.water.guardian.title'),
    description: t('achievement.water.guardian.desc'),
    icon: '💧',
    category: 'environmental',
    rarity: 'epic',
    points: 100,
    color: 'from-cyan-400 to-blue-600',
    requirements: [{ 
      type: 'lessons_completed', 
      target: 3, 
      current: 0, 
      description: 'Complete water-related lessons' 
    }],
    progress: 0
  },
  {
    id: 'climate_champion',
    title: t('achievement.climate.champion.title'),
    description: t('achievement.climate.champion.desc'),
    icon: '🌍',
    category: 'environmental',
    rarity: 'legendary',
    points: 200,
    color: 'from-orange-400 to-red-600',
    requirements: [{ 
      type: 'lessons_completed', 
      target: 5, 
      current: 0, 
      description: 'Complete climate change lessons' 
    }],
    progress: 0
  },
  {
    id: 'waste_manager',
    title: t('achievement.waste.manager.title'),
    description: t('achievement.waste.manager.desc'),
    icon: '♻️',
    category: 'environmental',
    rarity: 'rare',
    points: 75,
    color: 'from-yellow-400 to-orange-600',
    requirements: [{ 
      type: 'lessons_completed', 
      target: 2, 
      current: 0, 
      description: 'Complete waste management lessons' 
    }],
    progress: 0
  },

  // Game Achievements
  {
    id: 'game_master',
    title: t('achievement.game.master.title'),
    description: t('achievement.game.master.desc'),
    icon: '🎮',
    category: 'games',
    rarity: 'rare',
    points: 60,
    color: 'from-pink-400 to-rose-600',
    requirements: [{ 
      type: 'games_won', 
      target: 10, 
      current: 0, 
      description: 'Win 10 games' 
    }],
    progress: 0
  },
  {
    id: 'perfect_gamer',
    title: t('achievement.perfect.gamer.title'),
    description: t('achievement.perfect.gamer.desc'),
    icon: '⭐',
    category: 'games',
    rarity: 'epic',
    points: 80,
    color: 'from-yellow-400 to-yellow-600',
    requirements: [{ 
      type: 'games_won', 
      target: 3, 
      current: 0, 
      description: 'Get perfect scores in 3 games' 
    }],
    progress: 0
  },

  // Streak Achievements
  {
    id: 'daily_learner',
    title: t('achievement.daily.learner.title'),
    description: t('achievement.daily.learner.desc'),
    icon: '📅',
    category: 'streak',
    rarity: 'common',
    points: 30,
    color: 'from-teal-400 to-cyan-600',
    requirements: [{ 
      type: 'streak_days', 
      target: 3, 
      current: 0, 
      description: 'Learn for 3 days in a row' 
    }],
    progress: 0
  },
  {
    id: 'dedicated_learner',
    title: t('achievement.dedicated.learner.title'),
    description: t('achievement.dedicated.learner.desc'),
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    points: 75,
    color: 'from-red-400 to-pink-600',
    requirements: [{ 
      type: 'streak_days', 
      target: 7, 
      current: 0, 
      description: 'Learn for 7 days in a row' 
    }],
    progress: 0
  },
  {
    id: 'unstoppable_learner',
    title: t('achievement.unstoppable.learner.title'),
    description: t('achievement.unstoppable.learner.desc'),
    icon: '⚡',
    category: 'streak',
    rarity: 'legendary',
    points: 300,
    color: 'from-violet-400 to-purple-600',
    requirements: [{ 
      type: 'streak_days', 
      target: 30, 
      current: 0, 
      description: 'Learn for 30 days in a row' 
    }],
    progress: 0
  },

  // Special Achievements
  {
    id: 'certificate_earner',
    title: t('achievement.certificate.earner.title'),
    description: t('achievement.certificate.earner.desc'),
    icon: '🏆',
    category: 'special',
    rarity: 'epic',
    points: 100,
    color: 'from-amber-400 to-yellow-600',
    requirements: [{ 
      type: 'certificate_earned', 
      target: 1, 
      current: 0, 
      description: 'Earn 1 certificate' 
    }],
    progress: 0
  },
  {
    id: 'eco_warrior',
    title: t('achievement.eco.warrior.title'),
    description: t('achievement.eco.warrior.desc'),
    icon: '🛡️',
    category: 'special',
    rarity: 'legendary',
    points: 500,
    color: 'from-emerald-400 to-green-600',
    requirements: [{ 
      type: 'lessons_completed', 
      target: 15, 
      current: 0, 
      description: 'Complete all available lessons' 
    }],
    progress: 0
  },
  {
    id: 'point_collector',
    title: t('achievement.point.collector.title'),
    description: t('achievement.point.collector.desc'),
    icon: '💎',
    category: 'special',
    rarity: 'epic',
    points: 150,
    color: 'from-slate-400 to-gray-600',
    requirements: [{ 
      type: 'points_earned', 
      target: 1000, 
      current: 0, 
      description: 'Earn 1000 total points' 
    }],
    progress: 0
  }
];

export const getAchievementsByCategory = (category: string, t: (key: string) => string) => {
  return getAchievements(t).filter(achievement => achievement.category === category);
};

export const getAchievementsByRarity = (rarity: string, t: (key: string) => string) => {
  return getAchievements(t).filter(achievement => achievement.rarity === rarity);
};

export const getTotalPoints = (achievements: Achievement[]) => {
  return achievements
    .filter(achievement => achievement.unlockedAt)
    .reduce((total, achievement) => total + achievement.points, 0);
};
