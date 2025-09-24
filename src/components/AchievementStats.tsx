import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Award } from "lucide-react";
import { AchievementStats } from "@/types/achievements";
import { useLanguage } from "@/hooks/useLanguage";

interface AchievementStatsProps {
  stats: AchievementStats;
  className?: string;
}

export function AchievementStats({ stats, className = "" }: AchievementStatsProps) {
  const { t } = useLanguage();
  const completionPercentage = stats.totalAchievements > 0 
    ? (stats.unlockedAchievements / stats.totalAchievements) * 100 
    : 0;

  // Handle both old and new data structures
  const achievementsByCategory = stats.achievementsByCategory || {};
  const achievementsByRarity = (stats as any).achievementsByRarity || {};

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚';
      case 'environmental': return '🌱';
      case 'games': return '🎮';
      case 'streak': return '🔥';
      case 'special': return '⭐';
      default: return '🏆';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'environmental': return 'bg-green-100 text-green-800';
      case 'games': return 'bg-purple-100 text-purple-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'special': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '🥉';
      case 'rare': return '🥈';
      case 'epic': return '🥇';
      case 'legendary': return '💎';
      default: return '🏆';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>{t('achievements.progress.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.unlockedAchievements}/{stats.totalAchievements}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {t('achievements.progress.unlocked')}
            </p>
            <Progress 
              value={completionPercentage} 
              className="h-3 mb-2"
            />
            <p className="text-sm font-medium text-muted-foreground">
              {Math.round(completionPercentage)}% {t('achievements.progress.complete')}
            </p>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">{t('achievements.stats.total.points')}</span>
            </div>
            <span className="text-xl font-bold text-primary">
              {stats.totalPoints}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span>{t('achievements.by.category')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.keys(achievementsByCategory).length > 0 ? (
              Object.entries(achievementsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="text-sm font-medium capitalize">
                    {t(`achievements.categories.${category}`)}
                  </span>
                </div>
                <Badge className={getCategoryColor(category)}>
                  {count}
                </Badge>
              </div>
            ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <div className="flex flex-col items-center space-y-2">
                  <Target className="w-8 h-8 text-gray-300" />
                  <p className="text-sm">No achievements by category data available</p>
                  <p className="text-xs text-gray-400">Complete some achievements to see category breakdown</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {stats.recentAchievements && Array.isArray(stats.recentAchievements) && stats.recentAchievements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-500" />
              <span>{t('achievements.recent.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentAchievements.slice(0, 3).map((achievement) => {
                // Map achievement titles to translation keys
                const getTranslatedAchievementTitle = (title: string) => {
                  const titleLower = title.toLowerCase();
                  if (titleLower.includes('eco warrior') || titleLower.includes('environmental')) {
                    return t('achievement.eco.warrior');
                  } else if (titleLower.includes('first steps') || titleLower.includes('first lesson') || titleLower.includes('beginner')) {
                    return t('achievement.first.lesson');
                  } else if (titleLower.includes('quiz master') || titleLower.includes('quiz')) {
                    return t('achievement.quiz.master');
                  } else if (titleLower.includes('speed learner') || titleLower.includes('speed')) {
                    return t('achievement.speed.learner');
                  } else if (titleLower.includes('task master') || titleLower.includes('task')) {
                    return t('achievement.task.master');
    } else if (titleLower.includes('streak') || titleLower.includes('consecutive')) {
      return t('achievement.study.streak');
    } else if (titleLower.includes('dedicated learner') || titleLower.includes('dedicated')) {
      return t('achievement.dedicated.learner');
    } else if (titleLower.includes('completion') || titleLower.includes('complete')) {
      return t('achievement.lesson.completion');
    } else if (titleLower.includes('perfect') || titleLower.includes('100')) {
      return t('achievement.perfect.score');
    }
                  return title; // Return original if no match
                };

                return (
                  <div key={achievement.id} className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 truncate">
                        {getTranslatedAchievementTitle(achievement.title)}
                      </p>
                      <p className="text-xs text-green-600">
                        +{achievement.points} {t('achievements.points')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements by Rarity */}
      {Object.keys(achievementsByRarity).length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>{t('achievements.by.rarity')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(achievementsByRarity).map(([rarity, count]) => (
                <div key={rarity} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getRarityIcon(rarity)}</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {t(`achievements.rarity.${rarity}`)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
