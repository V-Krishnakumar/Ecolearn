import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Award } from "lucide-react";
import { AchievementStats } from "@/types/achievements";
import { useLanguage } from "@/contexts/LanguageContext";

interface AchievementStatsProps {
  stats: AchievementStats;
  className?: string;
}

export function AchievementStats({ stats, className = "" }: AchievementStatsProps) {
  const { t } = useLanguage();
  const completionPercentage = stats.totalAchievements > 0 
    ? (stats.unlockedAchievements / stats.totalAchievements) * 100 
    : 0;

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
            <p className="text-xs text-muted-foreground">
              {Math.round(completionPercentage)}% {t('achievements.progress.complete')}
            </p>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{t('achievements.stats.total.points')}</span>
            </div>
            <span className="text-lg font-bold text-primary">
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
            {Object.entries(stats.achievementsByCategory).map(([category, count]) => (
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
            ))}
            
            {Object.keys(stats.achievementsByCategory).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('achievements.progress.empty')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {stats.recentAchievements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-500" />
              <span>{t('achievements.recent.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 truncate">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-green-600">
                      +{achievement.points} {t('achievements.points')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
