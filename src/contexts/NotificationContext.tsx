import React, { createContext, useContext, useState, useCallback } from 'react';
import { PointsNotification } from '@/components/PointsNotification';
import { AchievementNotification } from '@/components/AchievementNotification';

interface PointsNotificationData {
  id: string;
  points: number;
  activity: string;
}

interface AchievementNotificationData {
  id: string;
  achievement: {
    id: number;
    title: string;
    description: string;
    points: number;
    rarity: string;
  };
}

interface NotificationContextType {
  showPointsNotification: (points: number, activity: string) => void;
  showAchievementNotification: (achievement: AchievementNotificationData['achievement']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [pointsNotifications, setPointsNotifications] = useState<PointsNotificationData[]>([]);
  const [achievementNotifications, setAchievementNotifications] = useState<AchievementNotificationData[]>([]);

  const showPointsNotification = useCallback((points: number, activity: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setPointsNotifications(prev => [...prev, { id, points, activity }]);
  }, []);

  const showAchievementNotification = useCallback((achievement: AchievementNotificationData['achievement']) => {
    const id = `${Date.now()}-${Math.random()}`;
    setAchievementNotifications(prev => [...prev, { id, achievement }]);
  }, []);

  const removePointsNotification = useCallback((id: string) => {
    setPointsNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const removeAchievementNotification = useCallback((id: string) => {
    setAchievementNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showPointsNotification, showAchievementNotification }}>
      {children}
      
      {/* Render points notifications */}
      {pointsNotifications.map(notification => (
        <PointsNotification
          key={notification.id}
          points={notification.points}
          activity={notification.activity}
          onClose={() => removePointsNotification(notification.id)}
        />
      ))}
      
      {/* Render achievement notifications */}
      {achievementNotifications.map(notification => (
        <AchievementNotification
          key={notification.id}
          achievement={notification.achievement}
          onClose={() => removeAchievementNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
