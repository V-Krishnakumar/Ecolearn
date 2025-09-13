import { useState, useEffect } from 'react';
import { getLocalProgress, setLocalProgress, ProgressData } from '@/lib/localProgress';
import { useUser } from '@/contexts/UserContext';

export function useProgress(lessonId: number) {
  const { user } = useUser();
  const [progress, setProgress] = useState<ProgressData>({
    video_progress: 0,
    video_completed: false,
    game_completed: false,
    quiz_completed: false,
    total_progress: 0
  });
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    if (user) {
      try {
        const progressData = getLocalProgress(user.id, lessonId);
        setProgress(progressData);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [user, lessonId]);

  const updateVideo = async (videoProgress: number, completed: boolean = false) => {
    if (user) {
      try {
        setLocalProgress(user.id, lessonId, {
          video_progress: videoProgress,
          video_completed: completed
        });
        setProgress(prev => ({
          ...prev,
          video_progress: videoProgress,
          video_completed: completed,
          total_progress: calculateTotalProgress({
            ...prev,
            video_progress: videoProgress,
            video_completed: completed
          })
        }));
        return true;
      } catch (error) {
        console.error('Error updating video progress:', error);
        return false;
      }
    }
    return false;
  };

  const updateGame = async (completed: boolean) => {
    if (user) {
      try {
        setLocalProgress(user.id, lessonId, {
          game_completed: completed
        });
        setProgress(prev => ({
          ...prev,
          game_completed: completed,
          total_progress: calculateTotalProgress({
            ...prev,
            game_completed: completed
          })
        }));
        return true;
      } catch (error) {
        console.error('Error updating game progress:', error);
        return false;
      }
    }
    return false;
  };

  const updateQuiz = async (completed: boolean) => {
    if (user) {
      try {
        setLocalProgress(user.id, lessonId, {
          quiz_completed: completed
        });
        setProgress(prev => ({
          ...prev,
          quiz_completed: completed,
          total_progress: calculateTotalProgress({
            ...prev,
            quiz_completed: completed
          })
        }));
        return true;
      } catch (error) {
        console.error('Error updating quiz progress:', error);
        return false;
      }
    }
    return false;
  };

  const calculateTotalProgress = (progressData: ProgressData): number => {
    let total = 0;
    if (progressData.video_completed) total += 50;
    if (progressData.game_completed) total += 30;
    if (progressData.quiz_completed) total += 20;
    return total;
  };

  return {
    progress,
    loading,
    updateVideo,
    updateGame,
    updateQuiz,
    refresh: loadProgress
  };
}