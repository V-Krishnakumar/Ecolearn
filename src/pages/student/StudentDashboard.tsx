import StudentNavigation from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock, Trophy, Star, FileText, GraduationCap, Thermometer, TreePine, Award, BookOpen, Target } from "lucide-react";
import NewsFacts from "@/components/NewsFacts";
import { useLanguage } from "@/hooks/useLanguage";
import { useUser } from "@/contexts/UserContext";
import { useSupabaseProgress } from "@/hooks/useSupabaseProgress";
import { useSupabaseAchievements } from "@/hooks/useSupabaseAchievements";
import { useStudentProgress } from "@/hooks/useSupabaseProgress";
import { StatisticsService } from "@/lib/supabase/statistics";
import { LessonService } from "@/lib/supabase/lessons";
import { LeaderboardService } from "@/lib/supabase/leaderboard";
import { AchievementStats } from "@/components/AchievementStats";
import { AchievementNotification } from "@/components/AchievementNotification";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScrollStoryAnimation from "@/components/ScrollStoryAnimation";

// Lesson images from public directory
const wasteManagementImg = "/images/lesson-waste-management.jpg";
const waterTreatmentImg = "/images/lesson-water-treatment.jpg";
const pollutionFreeImg = "/images/lesson-pollution-free.jpg";
const afforestationImg = "/images/lesson-afforestation.jpg";
const deforestationImg = "/images/lesson-deforestation.jpg";
const renewableEnergyImg = "/images/lesson-renewable-energy.jpg";

const getLessonsTemplate = (t: (key: string) => string) => [
  {
    id: 1,
    title: t('lesson.waste.management'),
    description: t('lesson.waste.management.desc'),
    image: wasteManagementImg,
    duration: `15 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner')
  },
  {
    id: 2,
    title: t('lesson.water.treatment'),
    description: t('lesson.water.treatment.desc'),
    image: waterTreatmentImg,
    duration: `12 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner')
  },
  {
    id: 3,
    title: t('lesson.pollution.free'),
    description: t('lesson.pollution.free.desc'),
    image: pollutionFreeImg,
    duration: `18 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate')
  },
  {
    id: 4,
    title: t('lesson.afforestation'),
    description: t('lesson.afforestation.desc'),
    image: afforestationImg,
    duration: `14 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner')
  },
  {
    id: 5,
    title: t('lesson.deforestation'),
    description: t('lesson.deforestation.desc'),
    image: deforestationImg,
    duration: `16 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate')
  },
  {
    id: 6,
    title: t('lesson.renewable.energy'),
    description: t('lesson.renewable.energy.desc'),
    image: renewableEnergyImg,
    duration: `20 ${t('common.minutes')}`,
    difficulty: t('difficulty.advanced')
  }
];

// Helper function to get lesson image based on category or title
const getLessonImage = (category: string, title: string) => {
  // First try to match by category
  switch (category.toLowerCase()) {
    case 'waste management':
      return wasteManagementImg;
    case 'water treatment':
      return waterTreatmentImg;
    case 'pollution free zones':
      return pollutionFreeImg;
    case 'afforestation':
      return afforestationImg;
    case 'deforestation':
      return deforestationImg;
    case 'renewable energy':
      return renewableEnergyImg;
    case 'environment':
      // If category is "Environment", try to match by title
      return getLessonImageByTitle(title);
    default:
      // Try to match by title as fallback
      return getLessonImageByTitle(title);
  }
};

// Helper function to get lesson image by title
const getLessonImageByTitle = (title: string) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('waste')) {
    return wasteManagementImg;
  } else if (titleLower.includes('water')) {
    return waterTreatmentImg;
  } else if (titleLower.includes('pollution')) {
    return pollutionFreeImg;
  } else if (titleLower.includes('afforestation')) {
    return afforestationImg;
  } else if (titleLower.includes('deforestation')) {
    return deforestationImg;
  } else if (titleLower.includes('renewable') || titleLower.includes('energy')) {
    return renewableEnergyImg;
  } else {
    return wasteManagementImg; // Default fallback
  }
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const { achievements, stats, loading: achievementsLoading, checkForNewAchievements } = useSupabaseAchievements();
  const { getCompletedLessons, getTotalPoints, getAverageScore } = useStudentProgress();
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [userStatistics, setUserStatistics] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [scoreboardLoading, setScoreboardLoading] = useState(false);
  
  // Provide default stats to prevent errors
  const safeStats = stats || {
    totalAchievements: 0,
    unlockedAchievements: 0,
    achievementsByCategory: {},
    achievementsByRarity: {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    }
  };
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);

  // Load lessons and progress from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setProgressLoading(true);
        
        // Load lessons
        const { data: lessonsData, error: lessonsError } = await LessonService.getLessons();
        if (lessonsError) {
          console.error('Error loading lessons:', lessonsError);
          setLessons(getLessonsTemplate(t));
        } else {
          // Transform Supabase lessons to match template format with translations
          const transformedLessons = lessonsData?.map(lesson => {
            // Map lesson titles and descriptions to translation keys
            const getTranslatedTitle = (title: string, category: string) => {
              const titleLower = title.toLowerCase();
              const categoryLower = category.toLowerCase();
              
              if (titleLower.includes('waste') || categoryLower.includes('waste')) {
                return t('lesson.waste.management');
              } else if (titleLower.includes('water') || categoryLower.includes('water')) {
                return t('lesson.water.treatment');
              } else if (titleLower.includes('pollution') || categoryLower.includes('pollution')) {
                return t('lesson.pollution.free');
              } else if (titleLower.includes('afforestation') || categoryLower.includes('afforestation')) {
                return t('lesson.afforestation');
              } else if (titleLower.includes('deforestation') || categoryLower.includes('deforestation')) {
                return t('lesson.deforestation');
              } else if (titleLower.includes('renewable') || titleLower.includes('energy') || categoryLower.includes('renewable') || categoryLower.includes('energy')) {
                return t('lesson.renewable.energy');
              } else if (titleLower.includes('climate') || categoryLower.includes('climate')) {
                return t('lesson.climate.change');
              } else if (titleLower.includes('biodiversity') || categoryLower.includes('biodiversity')) {
                return t('lesson.biodiversity');
              } else if (titleLower.includes('environmental') || categoryLower.includes('environmental')) {
                return t('lesson.environmental.policy');
              }
              return title; // Return original if no match
            };

            const getTranslatedDescription = (title: string, category: string) => {
              const titleLower = title.toLowerCase();
              const categoryLower = category.toLowerCase();
              
              if (titleLower.includes('waste') || categoryLower.includes('waste')) {
                return t('lesson.waste.management.desc');
              } else if (titleLower.includes('water') || categoryLower.includes('water')) {
                return t('lesson.water.treatment.desc');
              } else if (titleLower.includes('pollution') || categoryLower.includes('pollution')) {
                return t('lesson.pollution.free.desc');
              } else if (titleLower.includes('afforestation') || categoryLower.includes('afforestation')) {
                return t('lesson.afforestation.desc');
              } else if (titleLower.includes('deforestation') || categoryLower.includes('deforestation')) {
                return t('lesson.deforestation.desc');
              } else if (titleLower.includes('renewable') || titleLower.includes('energy') || categoryLower.includes('renewable') || categoryLower.includes('energy')) {
                return t('lesson.renewable.energy.desc');
              } else if (titleLower.includes('climate') || categoryLower.includes('climate')) {
                return t('lesson.climate.change.desc');
              } else if (titleLower.includes('biodiversity') || categoryLower.includes('biodiversity')) {
                return t('lesson.biodiversity.desc');
              } else if (titleLower.includes('environmental') || categoryLower.includes('environmental')) {
                return t('lesson.environmental.policy.desc');
              }
              return lesson.description || '';
            };

            const getTranslatedDifficulty = (difficulty: string) => {
              const difficultyLower = difficulty.toLowerCase();
              if (difficultyLower.includes('beginner') || difficultyLower.includes('easy')) {
                return t('difficulty.beginner');
              } else if (difficultyLower.includes('intermediate') || difficultyLower.includes('medium')) {
                return t('difficulty.intermediate');
              } else if (difficultyLower.includes('advanced') || difficultyLower.includes('hard')) {
                return t('difficulty.advanced');
              }
              return difficulty;
            };

            return {
              id: lesson.id,
              title: getTranslatedTitle(lesson.title, lesson.category),
              description: getTranslatedDescription(lesson.title, lesson.category),
              image: getLessonImage(lesson.category, lesson.title),
              duration: `${lesson.duration_minutes} ${t('common.minutes')}`,
              difficulty: getTranslatedDifficulty(lesson.difficulty),
              points: lesson.points,
              category: lesson.category
            };
          }) || [];
          
          if (transformedLessons.length === 0) {
            setLessons(getLessonsTemplate(t));
          } else {
            setLessons(transformedLessons);
          }
        }

        // Load user progress
        const { data: progressData, error: progressError } = await LessonService.getStudentProgress(user.id);
        if (progressError) {
          console.error('Error loading progress:', progressError);
          setUserProgress([]);
        } else {
          setUserProgress(progressData || []);
        }

        // Load user statistics
        const { data: statsData, error: statsError } = await StatisticsService.getUserStats(user.id);
        if (statsError) {
          console.error('Error loading user statistics:', statsError);
        } else {
          setUserStatistics(statsData);
        }

        // Load scoreboard data
        await loadScoreboardData();
      } catch (error) {
        console.error('Error loading data:', error);
        setLessons(getLessonsTemplate(t));
        setUserProgress([]);
      } finally {
        setLoading(false);
        setProgressLoading(false);
      }
    };

    loadData();
  }, [user, t]);

  // Listen for points earned events to refresh data
  useEffect(() => {
    const handlePointsEarned = () => {
      // Refresh data when points are earned
      if (user) {
        loadData();
        loadScoreboardData();
      }
    };

    window.addEventListener('pointsEarned', handlePointsEarned);
    
    return () => {
      window.removeEventListener('pointsEarned', handlePointsEarned);
    };
  }, [user]);

  // Calculate overall progress
  const completedLessons = getCompletedLessons().length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Calculate total time spent
  const totalTimeSpent = Array.isArray(userProgress) ? userProgress.reduce((total: number, lesson: any) => {
    return total + (lesson.time_spent_minutes || 0);
  }, 0) : 0;

  const averageScore = userStatistics?.averageQuizScore || getAverageScore() || 0;

  // Load scoreboard data
  const loadScoreboardData = async () => {
    if (!user) return;
    
    try {
      setScoreboardLoading(true);
      const scoreboardData = await LeaderboardService.getLeaderboardStats(user.id);
      setUserStats(scoreboardData);
    } catch (error) {
      console.error('Error loading scoreboard data:', error);
    } finally {
      setScoreboardLoading(false);
    }
  };

  useEffect(() => {
    // Check for new achievements periodically
    const checkAchievements = async () => {
      if (user && checkForNewAchievements) {
        try {
          const newAchievements = await checkForNewAchievements();
          if (newAchievements.length > 0) {
            setShowAchievementNotification(true);
          }
        } catch (error) {
          console.error('Error checking achievements:', error);
        }
      }
    };

    checkAchievements();
  }, [user, checkForNewAchievements]);

  const handleAchievementClose = () => {
    setShowAchievementNotification(false);
  };

  const getLessonStatus = (lessonId: number) => {
    if (!Array.isArray(userProgress)) return 'not-started';
    const lesson = userProgress.find(l => l.lesson_id === lessonId);
    if (!lesson) return 'not-started';
    return lesson.is_completed ? 'completed' : 'in-progress';
  };

  const getLessonProgress = (lessonId: number) => {
    if (!Array.isArray(userProgress)) return 0;
    const lesson = userProgress.find(l => l.lesson_id === lessonId);
    if (!lesson) return 0;
    return lesson.video_progress;
  };

  if (loading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <StudentNavigation />
        <div className="w-full px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020602]">
      {/* First portion is the cinematic scroll animation */}
      <ScrollStoryAnimation />
      
      {/* Dashboard Content Fades in at the end of the scroll container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 bg-gradient-to-b from-[#020602] to-white/95 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(2,6,2,0.8)]"
      >
        <div className="absolute top-0 w-full h-full bg-gradient-to-br from-green-50 to-blue-50 opacity-95 -z-10 rounded-t-[3rem]"></div>
      <StudentNavigation />
      
      <div className="w-full px-8 py-8 pt-12">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-nature rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🌱</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('dashboard.welcome')}
            </h1>
            {user?.id.startsWith('demo-') && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {t('demo.mode.badge')}
              </Badge>
            )}
          </div>
          <div className="text-lg text-gray-600 max-w-2xl mx-auto">
            <p className="mb-2">{t('student.dashboard.explore.lessons')}</p>
            <p>{t('student.dashboard.lesson.includes')}</p>
          </div>
        </div>


        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.overall.progress')}</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(overallProgress)}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.lessons.completed')}</p>
                  <p className="text-2xl font-bold text-gray-900">{completedLessons}/{totalLessons}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.total.time')}</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(totalTimeSpent)}h</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('student.dashboard.achievements')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unlockedAchievements}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content and News Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Main Content - Lessons Section */}
          <div className="lg:col-span-8">
            <Card className="bg-white shadow-lg border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {t('dashboard.environmental.lessons')}
                </CardTitle>
                <CardDescription>
                  {t('student.dashboard.continue.learning')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.length === 0 ? (
                    <div className="col-span-full text-center p-8">
                      <p className="text-gray-500">No lessons available</p>
                    </div>
                  ) : (
                    lessons.map((lesson) => {
                      const status = getLessonStatus(lesson.id);
                      const progress = getLessonProgress(lesson.id);
                      
                      
                      return (
                      <Card key={lesson.id} className="overflow-hidden bg-white">
                        <div className="relative">
                          <img
                            src={lesson.image}
                            alt={lesson.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge 
                              variant={status === 'completed' ? 'default' : status === 'in-progress' ? 'secondary' : 'outline'}
                              className="bg-white/90 text-gray-900"
                            >
                              {status === 'completed' ? t('lesson.completed') : 
                               status === 'in-progress' ? 'In Progress' : t('lesson.not.started')}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{lesson.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                              <Badge variant="outline">{lesson.difficulty}</Badge>
                            </div>

                            {status === 'in-progress' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>{t('student.dashboard.progress')}</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} />
                              </div>
                            )}

                            <Button
                              onClick={() => navigate(`/lesson/${lesson.id}`)}
                              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              {status === 'completed' ? t('lesson.review') : status === 'in-progress' ? t('lesson.continue') : t('lesson.start')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* News Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <NewsFacts />
            </div>
          </div>
        </div>

      </div>
      
      </motion.div>
    </div>
  );
}
