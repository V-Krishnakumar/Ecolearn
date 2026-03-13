// src/lib/supabase/seed-achievements.ts
import { supabase } from '../supabase';

export const seedAchievements = async () => {
  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎓",
      points: 50,
      category: "learning",
      rarity: "common",
      requirements: {
        lessons_completed: 1
      },
      is_active: true
    },
    {
      name: "Quiz Master",
      description: "Get perfect scores on 5 quizzes",
      icon: "🧠",
      points: 100,
      category: "learning",
      rarity: "rare",
      requirements: {
        perfect_quizzes: 5
      },
      is_active: true
    },
    {
      name: "Eco Warrior",
      description: "Complete all environmental modules",
      icon: "🌱",
      points: 200,
      category: "environmental",
      rarity: "epic",
      requirements: {
        lessons_completed: 10
      },
      is_active: true
    },
    {
      name: "Speed Learner",
      description: "Complete a lesson in under 10 minutes",
      icon: "⚡",
      points: 75,
      category: "learning",
      rarity: "rare",
      requirements: {
        activity_types: {
          "lesson_completed": 1
        }
      },
      is_active: true
    },
    {
      name: "Game Champion",
      description: "Win 10 educational games",
      icon: "🎮",
      points: 150,
      category: "games",
      rarity: "rare",
      requirements: {
        activity_types: {
          "game_completed": 10
        }
      },
      is_active: true
    },
    {
      name: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      points: 100,
      category: "streak",
      rarity: "rare",
      requirements: {
        consecutive_days: 7
      },
      is_active: true
    },
    {
      name: "Point Collector",
      description: "Earn 1000 total points",
      icon: "⭐",
      points: 200,
      category: "special",
      rarity: "epic",
      requirements: {
        total_points: 1000
      },
      is_active: true
    },
    {
      name: "Environmental Hero",
      description: "Complete 5 environmental actions",
      icon: "🌍",
      points: 300,
      category: "environmental",
      rarity: "legendary",
      requirements: {
        activity_types: {
          "task_submitted": 5
        }
      },
      is_active: true
    }
  ];

  try {
    console.log('Seeding achievements...');
    
    // Clear existing achievements first
    await supabase.from('achievements').delete().neq('id', 0);
    
    // Insert new achievements
    const { data, error } = await supabase
      .from('achievements')
      .insert(achievements)
      .select();

    if (error) {
      console.error('Error seeding achievements:', error);
      return { success: false, error };
    }

    console.log('Successfully seeded achievements:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error seeding achievements:', error);
    return { success: false, error };
  }
};

// Function to run the seeding
export const runSeedAchievements = async () => {
  const result = await seedAchievements();
  if (result.success) {
    console.log('✅ Achievements seeded successfully!');
  } else {
    console.error('❌ Failed to seed achievements:', result.error);
  }
  return result;
};
