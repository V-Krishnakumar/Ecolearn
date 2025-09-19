import StudentNavigation from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock, Trophy, Star, FileText } from "lucide-react";
import NewsFacts from "@/components/NewsFacts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useProgress } from "@/lib/localProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementStats } from "@/components/AchievementStats";
import { AchievementNotification } from "@/components/AchievementNotification";
import { useEffect, useState } from "react";

// Import lesson images
import wasteManagementImg from "@/assets/lesson-waste-management.jpg";
import waterTreatmentImg from "@/assets/lesson-water-treatment.jpg";
import pollutionFreeImg from "@/assets/lesson-pollution-free.jpg";
import afforestationImg from "@/assets/lesson-afforestation.jpg";
import deforestationImg from "@/assets/lesson-deforestation.jpg";
import renewableEnergyImg from "@/assets/lesson-renewable-energy.jpg";

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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const { getUserProgress, updateLessonProgress } = useProgress();
  const { achievements, stats, newAchievements, markAchievementAsSeen } = useAchievements();
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);


  const userProgress = user ? getUserProgress(user.id) : null;
  const lessons = getLessonsTemplate(t);

  // Calculate overall progress
  const completedLessons = userProgress ? Object.values(userProgress.lessons).filter((lesson: any) => lesson.completed).length : 0;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Calculate total time spent
  const totalTimeSpent = userProgress ? Object.values(userProgress.lessons).reduce((total: number, lesson: any) => {
    return total + (lesson.videoProgress / 100) * 15; // Assuming 15 minutes per lesson
  }, 0) : 0;

  useEffect(() => {
    if (newAchievements.length > 0) {
      setShowAchievementNotification(true);
    }
  }, [newAchievements]);

  const handleAchievementClose = () => {
    setShowAchievementNotification(false);
    newAchievements.forEach(achievement => {
      markAchievementAsSeen(achievement.id);
    });
  };

  const getLessonStatus = (lessonId: number) => {
    if (!userProgress) return 'not-started';
    const lesson = userProgress.lessons[lessonId] as any;
    if (!lesson) return 'not-started';
    return lesson.completed ? 'completed' : 'in-progress';
  };

  const getLessonProgress = (lessonId: number) => {
    if (!userProgress) return 0;
    const lesson = userProgress.lessons[lessonId] as any;
    if (!lesson) return 0;
    return lesson.videoProgress;
  };

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
              {lessons.map((lesson) => {
                const status = getLessonStatus(lesson.id);
                const progress = getLessonProgress(lesson.id);
                
                return (
                  <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AchievementStats stats={stats} />
          <NewsFacts />
        </div>

        {/* Achievement Notification */}
        {showAchievementNotification && newAchievements.length > 0 && newAchievements.map((achievement) => (
          <AchievementNotification
            key={achievement.id}
            achievement={achievement}
            onClose={handleAchievementClose}
          />
        ))}
      </div>
    </div>
  );
}
