import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, Star } from "lucide-react";
import { Achievement } from "@/lib/supabase/types";

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
  showProgress?: boolean;
  isUnlocked?: boolean;
  progress?: number;
}

export function AchievementCard({ 
  achievement, 
  onClick, 
  showProgress = true,
  isUnlocked = false,
  progress = 0
}: AchievementCardProps) {

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Star className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isUnlocked 
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl ${isUnlocked ? 'animate-pulse' : 'opacity-60'}`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <CardTitle className={`text-lg ${isUnlocked ? 'text-green-800' : 'text-gray-700'}`}>
                {achievement.name}
              </CardTitle>
              <p className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                {achievement.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isUnlocked ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Lock className="w-6 h-6 text-gray-400" />
            )}
            <Badge className={getRarityColor(achievement.rarity)}>
              <div className="flex items-center space-x-1">
                {getRarityIcon(achievement.rarity)}
                <span className="capitalize">{achievement.rarity}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      {showProgress && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className={isUnlocked ? 'text-green-700' : 'text-gray-600'}>
                Progress
              </span>
              <span className={`font-medium ${isUnlocked ? 'text-green-700' : 'text-gray-600'}`}>
                {Math.round(progress)}%
              </span>
            </div>
            
            <Progress 
              value={progress} 
              className={`h-2 ${
                isUnlocked 
                  ? '[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-600' 
                  : '[&>div]:bg-gradient-to-r [&>div]:from-gray-300 [&>div]:to-gray-400'
              }`} 
            />
            
            <div className="flex justify-between text-sm">
              <span className={isUnlocked ? 'text-green-600' : 'text-gray-500'}>
                {achievement.requirements[0]?.description}
              </span>
              <span className={`font-bold ${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                {achievement.points} pts
              </span>
            </div>
            
            {isUnlocked && achievement.unlockedAt && (
              <div className="text-xs text-green-600 text-center">
                Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
