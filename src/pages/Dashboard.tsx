import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock, Trophy, Star, FileText } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import NewsFacts from "@/components/NewsFacts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useProgress } from "@/lib/localProgress";
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
  const { t } = useLanguage();
  const { profile } = useUser();
  const { getDashboardData } = useProgress();
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="mb-8 text-center animate-slide-up">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {profile?.username ? `Welcome, ${profile.username}! 🌍` : t('dashboard.welcome')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('dashboard.subtitle')}
              </p>
            </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span>{t('dashboard.progress')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('dashboard.overall.progress')}</span>
                  <span className="font-medium">{Math.round(totalProgress)}{t('common.percent')}</span>
                </div>
                <Progress value={totalProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Star className="w-5 h-5 text-success" />
                <span>{t('dashboard.completed')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {completedLessons}
                <span className="text-lg font-normal text-muted-foreground">/{lessons.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('dashboard.lessons.completed')}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-secondary" />
                <span>{t('dashboard.total.time')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{totalTime.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">{t('dashboard.hours.learning')}</p>
            </CardContent>
          </Card>
        </div>

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
                    <h3 className="text-xl font-bold text-gray-800">Get Your Certificate</h3>
                    <p className="text-gray-600">Download your personalized Eco Warrior certificate</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/certificate')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <span>🌱</span>
            <span>{t('dashboard.environmental.lessons')}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className={`shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    {lesson.completed ? (
                      <Badge className="bg-success text-success-foreground">
                        {t('lesson.completed')}
                      </Badge>
                    ) : lesson.progress > 0 ? (
                      <Badge variant="secondary">
                        {lesson.progress}{t('common.percent')} {t('lesson.complete')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-white/90">
                        {t('lesson.not.started')}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {lesson.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {lesson.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-nature hover:opacity-90 transition-all duration-200"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {lesson.completed ? t('lesson.review') : lesson.progress > 0 ? t('lesson.continue') : t('lesson.start')}
                    </Button>
                  </div>
                  
                  {lesson.progress > 0 && (
                    <Progress value={lesson.progress} className="h-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

            {/* Motivational Section */}
            <Card className="bg-gradient-nature text-white shadow-glow">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">{t('dashboard.keep.going')}</h3>
                <p className="text-lg mb-6 opacity-90">
                  {t('dashboard.motivation')}
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/scoreboard")}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  {t('dashboard.view.achievements')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* News & Facts Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-8">
              <NewsFacts />
            </div>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
}