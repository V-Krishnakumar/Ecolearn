import StudentNavigation from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock, Trophy, Star, FileText, GraduationCap, Thermometer, TreePine, Award, BookOpen, Target } from "lucide-react";
import NewsFacts from "@/components/NewsFacts";
import { useLanguage } from "@/contexts/LanguageContext";
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
          // Transform Supabase lessons to match template format
          const transformedLessons = lessonsData?.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || '',
            image: getLessonImage(lesson.category, lesson.title),
            duration: lesson.duration_minutes,
            difficulty: lesson.difficulty,
            points: lesson.points,
            category: lesson.category
          })) || [];
          
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
        <div className="container mx-auto px-4 py-8">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <StudentNavigation />
      
      <div className="container mx-auto px-4 py-8">
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
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

        {/* Lessons Section */}
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

        {/* Advanced Modules Section */}
        <Card className="bg-white shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-purple-500" />
              <span>{t('nav.advanced.modules')}</span>
            </CardTitle>
            <CardDescription>
              Explore advanced environmental topics and deepen your knowledge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden card-hover cursor-pointer bg-white/95 backdrop-blur-sm"
                    onClick={() => navigate("/lesson/environmental-policy")}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">Advanced</Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Environmental Policy</h3>
                  <p className="text-sm text-gray-600 mb-4">Learn about environmental governance and policy frameworks</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                    <Button size="sm" className="bg-blue-50 text-blue-800 hover:opacity-90">
                      Start Learning
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden card-hover cursor-pointer bg-white/95 backdrop-blur-sm"
                    onClick={() => navigate("/lesson/climate-change")}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Thermometer className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">Advanced</Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Climate Change</h3>
                  <p className="text-sm text-gray-600 mb-4">Understand climate modeling and mitigation strategies</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                    <Button size="sm" className="bg-orange-50 text-orange-800 hover:opacity-90">
                      Start Learning
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden card-hover cursor-pointer bg-white/95 backdrop-blur-sm"
                    onClick={() => navigate("/lesson/biodiversity")}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <TreePine className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">Advanced</Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Biodiversity</h3>
                  <p className="text-sm text-gray-600 mb-4">Explore conservation strategies and ecosystem services</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                    <Button size="sm" className="bg-green-50 text-green-800 hover:opacity-90">
                      Start Learning
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="text-center mt-6">
              <Button onClick={() => navigate("/advanced-modules")} variant="outline">
{t('student.dashboard.view.all.advanced.modules')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scoreboard Section */}
        <Card className="bg-white shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>{t('student.dashboard.scoreboard.achievements')}</span>
            </CardTitle>
            <CardDescription>
              Track your progress and unlock achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scoreboardLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white">
                  <div className="text-2xl font-bold mb-1">
                    {userStats?.total_points || userStatistics?.totalPoints || 0}
                  </div>
                  <p className="text-sm opacity-90">Total Points</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {safeStats.unlockedAchievements || 0}
                  </div>
                  <p className="text-sm text-gray-600">Badges Earned</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {completedLessons}
                  </div>
                  <p className="text-sm text-gray-600">Lessons Done</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {Math.round((safeStats.unlockedAchievements || 0) / (safeStats.totalAchievements || 6) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Achievement Rate</p>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <Button 
                onClick={() => navigate("/scoreboard")} 
                variant="outline" 
                size="lg"
                disabled={scoreboardLoading}
              >
                <Trophy className="w-5 h-5 mr-2" />
{scoreboardLoading ? t('common.loading') : t('student.dashboard.view.full.scoreboard')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ErrorBoundary>
            <AchievementStats stats={safeStats} />
          </ErrorBoundary>
          <NewsFacts />
        </div>

        {/* Achievement Notification */}
        {showAchievementNotification && achievements.length > 0 && achievements.slice(0, 3).map((achievement) => (
          <AchievementNotification
            key={achievement.id}
            achievement={{
              id: achievement.id.toString(),
              title: achievement.name,
              description: achievement.description,
              icon: achievement.icon || '🏆',
              category: achievement.category || 'special',
              rarity: achievement.rarity,
              points: achievement.points,
              requirements: [],
              progress: 100,
              color: 'text-green-600'
            }}
            onClose={handleAchievementClose}
          />
        ))}
      </div>
      
    </div>
  );
}
