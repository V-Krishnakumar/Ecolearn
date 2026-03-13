import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Star } from "lucide-react";
import { Achievement } from "@/types/achievements";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function AchievementNotification({ 
  achievement, 
  onClose, 
  autoClose = true,
  duration = 5000 
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'epic': return <Star className="w-4 h-4 text-purple-600" />;
      case 'rare': return <Star className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <Card className={`w-80 shadow-2xl border-2 ${getRarityColor(achievement.rarity)} animate-in slide-in-from-right`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-2xl animate-pulse">
                  {achievement.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <h3 className="font-bold text-green-800 text-sm">
                    Achievement Unlocked!
                  </h3>
                </div>
                
                <p className="font-semibold text-gray-800 text-sm mb-1">
                  {achievement.title}
                </p>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {getRarityIcon(achievement.rarity)}
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      {achievement.rarity}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-green-600">
                    +{achievement.points} pts
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="flex-shrink-0 h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
