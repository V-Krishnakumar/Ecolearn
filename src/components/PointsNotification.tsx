import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Star } from "lucide-react";

interface PointsNotificationProps {
  points: number;
  activity: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function PointsNotification({ 
  points, 
  activity, 
  onClose, 
  autoClose = true,
  duration = 3000 
}: PointsNotificationProps) {
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

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'video_watched':
        return '🎥';
      case 'game_completed':
        return '🎮';
      case 'quiz_completed':
        return '📝';
      case 'lesson_completed':
        return '🎓';
      case 'task_submitted':
        return '📋';
      default:
        return '⭐';
    }
  };

  const getActivityText = (activity: string) => {
    switch (activity) {
      case 'video_watched':
        return 'Video Watched';
      case 'game_completed':
        return 'Game Completed';
      case 'quiz_completed':
        return 'Quiz Completed';
      case 'lesson_completed':
        return 'Lesson Completed';
      case 'task_submitted':
        return 'Task Submitted';
      default:
        return 'Activity Completed';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <Card className="w-80 shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">{getActivityIcon(activity)}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <h3 className="font-bold text-green-800 text-sm">
                  Congratulations! 🎉
                </h3>
              </div>
              
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {getActivityText(activity)}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-600">
                    Points Earned
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  +{points} pts
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
