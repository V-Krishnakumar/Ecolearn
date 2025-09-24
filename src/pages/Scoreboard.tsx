import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, Award, Target, BookOpen, Zap, Gift } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useUser } from "@/contexts/UserContext";
import { LeaderboardService } from "@/lib/supabase/leaderboard";
import { StatisticsService, WeeklyProgress, UserStats } from "@/lib/supabase/statistics";
import { LessonService } from "@/lib/supabase/lessons";
import { LeaderboardStats } from "@/lib/supabase/types";
import { useSupabaseAchievements } from "@/hooks/useSupabaseAchievements";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Leaderboard, Profile, Achievement } from "@/lib/supabase/types";

// Interface for leaderboard entry, aligned with LeaderboardService.getLeaderboard
interface LeaderboardEntry extends Leaderboard {
  profiles?: Profile;
}

// Interface for nextGoal, matching the return type from getNextAchievementGoal
interface NextGoal {
  achievement: {
    id: number;
    name: string;
    description: string;
    points: number;
    requirements?: any;
  };
  progress: number;
  total: number;
}

// Helper function to get day names in current language
const getDayNames = (t: (key: string) => string) => ({
  Sunday: t('day.sun'),
  Monday: t('day.mon'),
  Tuesday: t('day.tue'),
  Wednesday: t('day.wed'),
  Thursday: t('day.thu'),
  Friday: t('day.fri'),
  Saturday: t('day.sat'),
});

export default function Scoreboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const { achievements, getUnlockedAchievements } = useSupabaseAchievements();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<LeaderboardStats | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [userStatistics, setUserStatistics] = useState<UserStats | null>(null);
  const [nextGoal, setNextGoal] = useState<NextGoal | null>(null);
  const [completedLessons, setCompletedLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all scoreboard data from Supabase
  const loadScoreboardData = async () => {
    if (!user) {
      setLoading(false);
      setError('Please log in to view your scoreboard.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        { data: leaderboardData, error: leaderboardError },
        userStatsData,
        weeklyData,
        statsData,
        goalData,
        { data: progressData, error: progressError },
      ] = await Promise.all([
        LeaderboardService.getLeaderboard(10),
        LeaderboardService.getLeaderboardStats(user.id),
        StatisticsService.getWeeklyProgress(user.id),
        StatisticsService.getUserStats(user.id),
        StatisticsService.getNextAchievementGoal(user.id),
        LessonService.getStudentProgress(user.id),
      ]);

      if (leaderboardError) console.error('Error loading leaderboard:', leaderboardError);
      else setLeaderboard(leaderboardData || []);

      // Set user stats (don't create leaderboard entries here)
      setUserStats(userStatsData);

      setWeeklyProgress(weeklyData || []);

      setUserStatistics(statsData);

      setNextGoal(goalData);

      if (progressError) console.error('Error loading progress:', progressError);
      else {
        const completed = progressData?.filter(p => p.is_completed) || [];
        setCompletedLessons(completed);
      }
    } catch (error) {
      console.error('Error loading scoreboard data:', error);
      setError('Failed to load scoreboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription and initial load
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('leaderboard-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        () => {
          console.log('Leaderboard update detected');
          loadScoreboardData();
        }
      )
      .subscribe();

    loadScoreboardData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const unlockedAchievements = getUnlockedAchievements();
  const totalPoints = userStats?.total_points || userStatistics?.totalPoints || 0;
  const earnedAchievements = unlockedAchievements.length;

  const completionRate = userStatistics?.completionRate || (achievements.length > 0 ? (earnedAchievements / achievements.length) * 100 : 0);
  const dayNames = getDayNames(t);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <Button onClick={loadScoreboardData} className="mt-4">
              {t('common.retry')}
            </Button>
          </div>
        )}
        {!error && (
          <>
            {/* Header */}
            <div className="text-center mb-8 animate-slide-up">
              <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center space-x-3">
                <Trophy className="w-10 h-10 text-accent" />
                <span>{t('scoreboard.title')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('scoreboard.subtitle')}
              </p>
              <Button 
                onClick={loadScoreboardData} 
                disabled={loading}
                className="mt-4"
                variant="outline"
              >
                {loading ? t('common.refreshing') : t('common.refresh.data')}
              </Button>
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
                  <div className="text-3xl font-bold text-success mb-2">{completedLessons.length}</div>
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
                      {achievements.slice(0, 6).map((achievement, index) => {
                        const isUnlocked = unlockedAchievements.some(ua => ua.achievement_id === achievement.id);
                        
                        // Map achievement names and descriptions to translation keys
                        const getTranslatedAchievementName = (name: string) => {
                          const nameLower = name.toLowerCase();
                          if (nameLower.includes('eco warrior') || nameLower.includes('environmental')) {
                            return t('achievement.eco.warrior');
                          } else if (nameLower.includes('first steps') || nameLower.includes('first lesson') || nameLower.includes('beginner')) {
                            return t('achievement.first.lesson');
                          } else if (nameLower.includes('quiz master') || nameLower.includes('quiz')) {
                            return t('achievement.quiz.master');
                          } else if (nameLower.includes('speed learner') || nameLower.includes('speed')) {
                            return t('achievement.speed.learner');
                          } else if (nameLower.includes('task master') || nameLower.includes('task')) {
                            return t('achievement.task.master');
    } else if (nameLower.includes('streak') || nameLower.includes('consecutive')) {
      return t('achievement.study.streak');
    } else if (nameLower.includes('dedicated learner') || nameLower.includes('dedicated')) {
      return t('achievement.dedicated.learner');
    } else if (nameLower.includes('completion') || nameLower.includes('complete')) {
      return t('achievement.lesson.completion');
    } else if (nameLower.includes('perfect') || nameLower.includes('100')) {
      return t('achievement.perfect.score');
    }
                          return name; // Return original if no match
                        };

                        const getTranslatedAchievementDescription = (name: string, description: string) => {
                          const nameLower = name.toLowerCase();
                          if (nameLower.includes('eco warrior') || nameLower.includes('environmental')) {
                            return t('achievement.eco.warrior.desc');
                          } else if (nameLower.includes('first steps') || nameLower.includes('first lesson') || nameLower.includes('beginner')) {
                            return t('achievement.first.lesson.desc');
                          } else if (nameLower.includes('quiz master') || nameLower.includes('quiz')) {
                            return t('achievement.quiz.master.desc');
                          } else if (nameLower.includes('speed learner') || nameLower.includes('speed')) {
                            return t('achievement.speed.learner.desc');
                          } else if (nameLower.includes('task master') || nameLower.includes('task')) {
                            return t('achievement.task.master.desc');
    } else if (nameLower.includes('streak') || nameLower.includes('consecutive')) {
      return t('achievement.study.streak.desc');
    } else if (nameLower.includes('dedicated learner') || nameLower.includes('dedicated')) {
      return t('achievement.dedicated.learner.desc');
    } else if (nameLower.includes('completion') || nameLower.includes('complete')) {
      return t('achievement.lesson.completion.desc');
    } else if (nameLower.includes('perfect') || nameLower.includes('100')) {
      return t('achievement.perfect.score.desc');
    }
                          return description; // Return original if no match
                        };

                        return (
                          <div
                            key={achievement.id}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 animate-slide-up ${
                              isUnlocked
                                ? "border-primary bg-primary/5 shadow-glow"
                                : "border-muted-foreground/20 bg-muted/30"
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${isUnlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                                  <span className="text-2xl">{achievement.icon}</span>
                                </div>
                                <div>
                                  <h3 className={`font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {getTranslatedAchievementName(achievement.name)}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {getTranslatedAchievementDescription(achievement.name, achievement.description)}
                                  </p>
                                  {isUnlocked && (
                                    <p className="text-xs text-primary mt-1">
                                      {t('scoreboard.earned')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={isUnlocked ? "default" : "outline"}
                                  className={isUnlocked ? "bg-primary" : ""}
                                >
                                  {isUnlocked ? t('scoreboard.earned') : t('scoreboard.locked')}
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
                        <span>{completedLessons.length}/6 {t('scoreboard.lessons')}</span>
                      </div>
                      <Progress value={(completedLessons.length / 6) * 100} className="h-3 bg-white/20" />
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
                      {weeklyProgress.length > 0 ? weeklyProgress.map((day, index) => (
                        <div key={day.day} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium w-8">{dayNames[day.day as keyof typeof dayNames] || day.day}</span>
                            <div className="flex-1 w-24">
                              <Progress value={day.progress} className="h-2" />
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {day.lessons} {day.lessons !== 1 ? t('scoreboard.lessons') : t('scoreboard.lesson')}
                          </Badge>
                        </div>
                      )) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">No activity this week</p>
                        </div>
                      )}
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
                      <Badge className="bg-accent">
                        {userStatistics?.studyStreak || 0} {t('common.days')} 🔥
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('scoreboard.avg.quiz.score')}</span>
                      <Badge variant="secondary">
                        {userStatistics?.averageQuizScore || 0}{t('common.percent')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('scoreboard.favorite.topic')}</span>
                      <Badge variant="outline">
                        {userStatistics?.favoriteTopic || t('lesson.waste.management')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('scoreboard.time.spent')}</span>
                      <Badge variant="secondary">
                        {userStatistics?.timeSpent || 0} {t('common.hours')}
                      </Badge>
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
                      <h3 className="font-semibold mb-2">
                        {nextGoal?.achievement?.name || t('achievement.eco.warrior')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {nextGoal?.achievement?.description || t('achievement.eco.warrior.desc')}
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>{t('scoreboard.progress')}</span>
                          <span>{nextGoal?.progress || 0}/{nextGoal?.total || 1}</span>
                        </div>
                        <Progress 
                          value={nextGoal ? (nextGoal.progress / nextGoal.total) * 100 : 0} 
                          className="h-2" 
                        />
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

                {/* Real-time Leaderboard */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span>{t('scoreboard.leaderboard')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.map((entry, index) => (
                          <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{entry.profiles?.username || 'Anonymous'}</p>
                                <p className="text-sm text-muted-foreground">Level {entry.profiles?.level || 1}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{entry.total_points}</p>
                              <p className="text-sm text-muted-foreground">points</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
