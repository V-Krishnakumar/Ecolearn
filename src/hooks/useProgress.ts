import { useState, useEffect } from 'react';
import { LocalProgress, LessonProgress, UserProgress } from '@/lib/localProgress';
import { useUser } from '@/contexts/UserContext';

export function useProgress(lessonId: number) {
  const { user } = useUser();
  const [progress, setProgress] = useState<LessonProgress>({
    lessonId,
    videoProgress: 0,
    gameCompleted: false,
    quizCompleted: false,
    quizScore: 0,
    lastAccessed: new Date().toISOString(),
    completed: false
  });
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    if (user) {
      try {
        const progressData = LocalProgress.getLessonProgress(user.id, lessonId);
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
        LocalProgress.updateLessonProgress(user.id, lessonId, {
          videoProgress,
          completed: completed && progress.gameCompleted && progress.quizCompleted
        });
        setProgress(prev => ({
          ...prev,
          videoProgress,
          completed: completed && prev.gameCompleted && prev.quizCompleted
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
        LocalProgress.updateLessonProgress(user.id, lessonId, {
          gameCompleted: completed,
          completed: completed && progress.videoProgress >= 100 && progress.quizCompleted
        });
        setProgress(prev => ({
          ...prev,
          gameCompleted: completed,
          completed: completed && prev.videoProgress >= 100 && prev.quizCompleted
        }));
        return true;
      } catch (error) {
        console.error('Error updating game progress:', error);
        return false;
      }
    }
    return false;
  };

  const updateQuiz = async (completed: boolean, score: number = 0) => {
    if (user) {
      try {
        LocalProgress.updateLessonProgress(user.id, lessonId, {
          quizCompleted: completed,
          quizScore: score,
          completed: completed && progress.videoProgress >= 100 && progress.gameCompleted
        });
        setProgress(prev => ({
          ...prev,
          quizCompleted: completed,
          quizScore: score,
          completed: completed && prev.videoProgress >= 100 && prev.gameCompleted
        }));
        return true;
      } catch (error) {
        console.error('Error updating quiz progress:', error);
        return false;
      }
    }
    return false;
  };

  const calculateTotalProgress = (progressData: LessonProgress): number => {
    let total = 0;
    if (progressData.videoProgress >= 100) total += 40;
    if (progressData.gameCompleted) total += 30;
    if (progressData.quizCompleted) total += 30;
    return total;
  };

  return {
    progress,
    loading,
    updateVideo,
    updateGame,
    updateQuiz,
    refresh: loadProgress,
    totalProgress: calculateTotalProgress(progress)
  };
}