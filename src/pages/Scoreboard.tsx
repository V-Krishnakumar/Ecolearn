import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, Award, Target, BookOpen, Zap, Crown, Medal, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getAchievements = (t: (key: string) => string) => [
  {
    id: 1,
    title: t('achievement.first.steps'),
    description: t('achievement.first.steps.desc'),
    icon: BookOpen,
    earned: true,
    date: "2024-01-15",
    points: 50,
    color: "text-success"
  },
  {
    id: 2,
    title: t('achievement.quiz.master'),
    description: t('achievement.quiz.master.desc'),
    icon: Target,
    earned: true,
    date: "2024-01-16",
    points: 100,
    color: "text-primary"
  },
  {
    id: 3,
    title: t('achievement.eco.warrior'),
    description: t('achievement.eco.warrior.desc'),
    icon: Award,
    earned: false,
    date: null,
    points: 200,
    color: "text-accent"
  },
  {
    id: 4,
    title: t('achievement.speed.learner'),
    description: t('achievement.speed.learner.desc'),
    icon: Zap,
    earned: true,
    date: "2024-01-17",
    points: 75,
    color: "text-secondary"
  },
  {
    id: 5,
    title: t('achievement.perfect.score'),
    description: t('achievement.perfect.score.desc'),
    icon: Crown,
    earned: false,
    date: null,
    points: 300,
    color: "text-accent"
  },
  {
    id: 6,
    title: t('achievement.dedicated.learner'),
    description: t('achievement.dedicated.learner.desc'),
    icon: Medal,
    earned: false,
    date: null,
    points: 250,
    color: "text-primary"
  }
];

const getWeeklyProgress = (t: (key: string) => string) => [
  { day: t('day.mon'), progress: 75, lessons: 2 },
  { day: t('day.tue'), progress: 50, lessons: 1 },
  { day: t('day.wed'), progress: 100, lessons: 3 },
  { day: t('day.thu'), progress: 25, lessons: 1 },
  { day: t('day.fri'), progress: 80, lessons: 2 },
  { day: t('day.sat'), progress: 90, lessons: 2 },
  { day: t('day.sun'), progress: 60, lessons: 1 }
];

export default function Scoreboard() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const achievements = getAchievements(t);
  const weeklyProgress = getWeeklyProgress(t);
  
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const completionRate = (earnedAchievements / achievements.length) * 100;

  return (
    <div key={language} className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center space-x-3">
            <Trophy className="w-10 h-10 text-accent" />
            <span>{t('scoreboard.title')}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('scoreboard.subtitle')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card text-center bg-gradient-nature text-white">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">{totalPoints}</div>
              <p className="text-white/90">{t('scoreboard.total.points')}</p>
              <Star className="w-6 h-6 mx-auto mt-2 animate-bounce-gentle" />
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">{earnedAchievements}</div>
              <p className="text-muted-foreground">{t('scoreboard.badges.earned')}</p>
              <Award className="w-6 h-6 mx-auto mt-2 text-primary" />
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-2">1</div>
              <p className="text-muted-foreground">{t('scoreboard.lessons.completed')}</p>
              <BookOpen className="w-6 h-6 mx-auto mt-2 text-success" />
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-secondary mb-2">{Math.round(completionRate)}{t('common.percent')}</div>
              <p className="text-muted-foreground">{t('scoreboard.achievement.rate')}</p>
              <Target className="w-6 h-6 mx-auto mt-2 text-secondary" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2">
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-accent" />
                  <span>{t('scoreboard.achievement.badges')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 animate-slide-up ${
                          achievement.earned
                            ? "border-primary bg-primary/5 shadow-glow"
                            : "border-muted-foreground/20 bg-muted/30"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${achievement.earned ? 'bg-primary/10' : 'bg-muted'}`}>
                              <IconComponent 
                                className={`w-6 h-6 ${achievement.earned ? achievement.color : 'text-muted-foreground'}`} 
                              />
                            </div>
                            <div>
                              <h3 className={`font-semibold ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {achievement.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              {achievement.earned && achievement.date && (
                                <p className="text-xs text-primary mt-1">
                                  {t('scoreboard.earned.on')} {new Date(achievement.date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={achievement.earned ? "default" : "outline"}
                              className={achievement.earned ? "bg-primary" : ""}
                            >
                              {achievement.earned ? t('scoreboard.earned') : t('scoreboard.locked')}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {achievement.points} {t('common.points')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Certificate Section */}
            <Card className="shadow-card bg-gradient-earth text-white">
              <CardContent className="p-8 text-center">
                <Gift className="w-16 h-16 mx-auto mb-4 animate-bounce-gentle" />
                <h3 className="text-2xl font-bold mb-4">{t('scoreboard.certificate.title')}</h3>
                <p className="text-white/90 mb-6">
                  {t('scoreboard.certificate.desc')}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t('scoreboard.progress.to.certificate')}</span>
                    <span>1/6 {t('scoreboard.lessons')}</span>
                  </div>
                  <Progress value={16.67} className="h-3 bg-white/20" />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  {t('scoreboard.continue.learning')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress & Leaderboard */}
          <div className="space-y-6">
            {/* Weekly Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span>{t('scoreboard.weekly.activity')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyProgress.map((day, index) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">{day.day}</span>
                        <div className="flex-1 w-24">
                          <Progress value={day.progress} className="h-2" />
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {day.lessons} {day.lessons !== 1 ? t('scoreboard.lessons') : t('scoreboard.lesson')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span>{t('scoreboard.quick.stats')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('scoreboard.study.streak')}</span>
                  <Badge className="bg-accent">3 {t('common.days')} 🔥</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('scoreboard.avg.quiz.score')}</span>
                  <Badge variant="secondary">85{t('common.percent')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('scoreboard.favorite.topic')}</span>
                  <Badge variant="outline">{t('lesson.waste.management')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('scoreboard.time.spent')}</span>
                  <Badge variant="secondary">2.5 {t('common.hours')}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Achievement */}
            <Card className="shadow-card border-accent">
              <CardHeader>
                <CardTitle className="text-accent flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>{t('scoreboard.next.goal')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Award className="w-12 h-12 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{t('achievement.eco.warrior')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('achievement.eco.warrior.desc')}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('scoreboard.progress')}</span>
                      <span>1/3</span>
                    </div>
                    <Progress value={33.33} className="h-2" />
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/dashboard")}
                    className="w-full"
                  >
                    {t('scoreboard.continue.learning')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}