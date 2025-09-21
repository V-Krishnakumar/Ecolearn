import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock, Trophy, Star, FileText, GraduationCap, Thermometer, TreePine, ArrowRight, Award, BookOpen, Target } from "lucide-react";
import NewsFacts from "@/components/NewsFacts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useProgress } from "@/lib/localProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementStats } from "@/components/AchievementStats";
import { AchievementNotification } from "@/components/AchievementNotification";
import { DecorativeDivider, EcoBackground } from "@/components/DecorativeElements";
import CustomButton from "@/components/CustomButton";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { profile } = useUser();
  const { getDashboardData } = useProgress();
  const { stats, newAchievements, dismissNotification } = useAchievements();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const data = getDashboardData();
    if (data) {
      setDashboardData(data);
      
      // Merge template with progress data
      const lessonsTemplate = getLessonsTemplate(t);
      const lessonsWithProgress = lessonsTemplate.map(lesson => {
        const progressData = data.lessons.find((l: any) => l.id === lesson.id);
        return {
          ...lesson,
          progress: progressData?.progress || 0,
          completed: progressData?.completed || false,
          videoProgress: progressData?.videoProgress || 0,
          gameCompleted: progressData?.gameCompleted || false,
          quizCompleted: progressData?.quizCompleted || false
        };
      });
      
      setLessons(lessonsWithProgress);
    } else {
      // Fallback to template without progress
      setLessons(getLessonsTemplate(t).map(lesson => ({
        ...lesson,
        progress: 0,
        completed: false,
        videoProgress: 0,
        gameCompleted: false,
        quizCompleted: false
      })));
    }
  }, [t, getDashboardData]);

  const completedLessons = dashboardData?.completedLessons || 0;
  const totalProgress = dashboardData?.overallProgress || 0;
  const totalTime = dashboardData?.totalTime || 0;

  return (
    <EcoBackground key={language} className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="mb-8 text-center animate-slide-up">
              <div className="kid-card p-8 mb-6 decorative-border">
                <h1 className="kid-title mb-4">
                  {profile?.username ? `Welcome, ${profile.username}! 🌍` : t('dashboard.welcome')}
                </h1>
                <p className="text-xl text-gray-700 font-semibold max-w-2xl mx-auto">
                  {t('dashboard.subtitle')}
                </p>
                <div className="flex justify-center mt-6 space-x-4">
                  <span className="text-3xl animate-bounce-playful">🌿</span>
                  <span className="text-3xl animate-bounce-playful" style={{animationDelay: '0.5s'}}>🌺</span>
                  <span className="text-3xl animate-bounce-playful" style={{animationDelay: '1s'}}>🦋</span>
                  <span className="text-3xl animate-bounce-playful" style={{animationDelay: '1.5s'}}>🌻</span>
                  <span className="text-3xl animate-bounce-playful" style={{animationDelay: '2s'}}>🌱</span>
                </div>
              </div>
            </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="kid-card hover:shadow-glow transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="kid-subtitle text-emerald-800">{t('dashboard.progress')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-emerald-700">{t('dashboard.overall.progress')}</span>
                  <span className="text-emerald-800 font-bold text-lg">{Math.round(totalProgress)}{t('common.percent')}</span>
                </div>
                <Progress value={totalProgress} className="h-4 bg-emerald-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="kid-card hover:shadow-glow transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="kid-subtitle text-blue-800">{t('dashboard.completed')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-blue-600 mb-2">
                {completedLessons}
                <span className="text-xl font-bold text-blue-500">/{lessons.length}</span>
              </div>
              <p className="text-sm font-semibold text-blue-700">{t('dashboard.lessons.completed')}</p>
            </CardContent>
          </Card>

          <Card className="kid-card hover:shadow-glow transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="kid-subtitle text-yellow-800">{t('dashboard.total.time')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-yellow-600 mb-2">{totalTime.toFixed(1)}</div>
              <p className="text-sm font-semibold text-yellow-700">{t('dashboard.hours.learning')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Decorative Divider */}
        <DecorativeDivider type="hills" className="my-12" />

        {/* Certificate Section */}
        <div className="mb-8">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t('dashboard.get.certificate.title')}</h3>
                    <p className="text-gray-600">{t('dashboard.get.certificate.desc')}</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/certificate')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t('dashboard.view.certificate')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>{t('dashboard.achievements.title')}</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AchievementStats stats={stats} />
          </div>
        </div>

        {/* Advanced Modules Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-purple-500" />
            <span>{t('dashboard.advanced.modules.title')}</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">{t('dashboard.advanced.modules.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate("/lesson/environmental-policy")}>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {t('advanced.common.advanced')}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{t('advanced.environmental.title')}</CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('advanced.environmental.description')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>20 {t('advanced.common.seconds')}</span>
                  </div>
                </div>
                <CustomButton>
                  {t('advanced.common.start.learning')}
                </CustomButton>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate("/lesson/climate-change")}>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {t('advanced.common.advanced')}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{t('advanced.climate.title')}</CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('advanced.climate.description')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>20 {t('advanced.common.seconds')}</span>
                  </div>
                </div>
                <CustomButton>
                  {t('advanced.common.start.learning')}
                </CustomButton>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate("/lesson/biodiversity")}>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {t('advanced.common.advanced')}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{t('advanced.biodiversity.title')}</CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('advanced.biodiversity.description')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>20 {t('advanced.common.seconds')}</span>
                  </div>
                </div>
                <CustomButton>
                  {t('advanced.common.start.learning')}
                </CustomButton>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-6">
            <Button onClick={() => navigate("/advanced-modules")} variant="outline">
              {t('dashboard.view.all.advanced')}
            </Button>
          </div>
        </div>

        {/* Scoreboard Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>{t('dashboard.scoreboard.title')}</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">{t('dashboard.scoreboard.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="shadow-card text-center bg-gradient-nature text-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-2">{stats.totalPoints || 225}</div>
                <p className="text-white/90">{t('dashboard.total.points')}</p>
                <Star className="w-6 h-6 mx-auto mt-2 animate-bounce-gentle" />
              </CardContent>
            </Card>
            
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{stats.unlockedAchievements || 3}</div>
                <p className="text-muted-foreground">{t('dashboard.badges.earned')}</p>
                <Award className="w-6 h-6 mx-auto mt-2 text-primary" />
              </CardContent>
            </Card>
            
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-success mb-2">{completedLessons}</div>
                <p className="text-muted-foreground">{t('dashboard.lessons.completed')}</p>
                <BookOpen className="w-6 h-6 mx-auto mt-2 text-success" />
              </CardContent>
            </Card>
            
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-secondary mb-2">{Math.round((stats.unlockedAchievements || 3) / 6 * 100)}%</div>
                <p className="text-muted-foreground">{t('dashboard.achievement.rate')}</p>
                <Target className="w-6 h-6 mx-auto mt-2 text-secondary" />
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button onClick={() => navigate("/scoreboard")} variant="outline" size="lg">
              <Trophy className="w-5 h-5 mr-2" />
              {t('dashboard.view.full.scoreboard')}
            </Button>
          </div>
        </div>

        {/* Decorative Divider */}
        <DecorativeDivider type="waves" className="my-12" />

        {/* Lessons Grid */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="kid-title mb-4 flex items-center justify-center space-x-3">
              <span className="text-4xl animate-bounce-playful">🌱</span>
              <span>{t('dashboard.environmental.lessons')}</span>
              <span className="text-4xl animate-bounce-playful" style={{animationDelay: '0.5s'}}>🌿</span>
            </h2>
            <p className="text-lg text-gray-600 font-semibold">Choose your next eco-adventure!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className={`kid-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:-translate-y-2 hover:scale-105 animate-slide-up decorative-border`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    {lesson.completed ? (
                      <Badge className="kid-badge bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
                        ✅ {t('lesson.completed')}
                      </Badge>
                    ) : lesson.progress > 0 ? (
                      <Badge className="kid-badge bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                        🔄 {lesson.progress}{t('common.percent')} {t('lesson.complete')}
                      </Badge>
                    ) : (
                      <Badge className="kid-badge bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                        🚀 {t('lesson.not.started')}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="kid-badge bg-white/95 text-gray-800 shadow-lg font-bold">
                      {lesson.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors font-bold text-gray-800">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600 font-medium">
                    {lesson.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 font-semibold">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>{lesson.duration}</span>
                    </div>
                    <CustomButton>
                      {lesson.completed ? t('lesson.review') : lesson.progress > 0 ? t('lesson.continue') : t('lesson.start')}
                    </CustomButton>
                  </div>
                  
                  {lesson.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-gray-600">
                        <span>Progress</span>
                        <span>{lesson.progress}%</span>
                      </div>
                      <Progress value={lesson.progress} className="h-3 bg-gray-200" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

            {/* Motivational Section */}
            <Card className="kid-card bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white shadow-glow decorative-border">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <span className="text-6xl animate-bounce-playful">🎉</span>
                </div>
                <h3 className="text-3xl font-black mb-4">{t('dashboard.keep.going')}</h3>
                <p className="text-xl mb-6 font-semibold opacity-95">
                  {t('dashboard.motivation')}
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate("/scoreboard")}
                  className="kid-button bg-white text-purple-600 hover:bg-yellow-100 font-bold text-lg shadow-xl"
                >
                  <Trophy className="w-6 h-6 mr-3" />
                  {t('dashboard.view.achievements')}
                </Button>
                <div className="flex justify-center mt-4 space-x-2">
                  <span className="text-2xl animate-bounce-playful">🏆</span>
                  <span className="text-2xl animate-bounce-playful" style={{animationDelay: '0.3s'}}>⭐</span>
                  <span className="text-2xl animate-bounce-playful" style={{animationDelay: '0.6s'}}>🌟</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* News & Facts Sidebar */}
          <div className="hidden lg:block w-96 flex-shrink-0">
            <div className="sticky top-8">
              <NewsFacts />
            </div>
          </div>
        </div>
      </main>

      {/* Achievement Notifications */}
      {newAchievements.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => dismissNotification(achievement.id)}
        />
      ))}
      
    </EcoBackground>
  );
}