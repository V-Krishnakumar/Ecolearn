// src/hooks/useSupabaseProgress.ts
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { LessonService } from '@/lib/supabase/lessons';
import { StudentLessonProgress } from '@/lib/supabase/types';
import { LocalProgress } from '@/lib/localProgress';

export function useSupabaseProgress(lessonId: number) {
  const { user } = useUser();
  const [progress, setProgress] = useState<StudentLessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Debug: Log progress changes
  useEffect(() => {
    console.log('Progress state changed:', progress);
  }, [progress]);

  const loadProgress = useCallback(async () => {
    if (user && lessonId > 0 && !initialized) {
      try {
        setLoading(true);
        const { data, error } = await LessonService.getLessonProgress(user.id, lessonId);
        
        if (error) {
          console.error('Error loading progress from Supabase:', error);
          // Handle different error types appropriately
          if (error.code === 'PGRST116' || error.message?.includes('no rows found') || error.message?.includes('Cannot coerce the result to a single JSON object')) {
            // No data found in Supabase - new user, start fresh
            console.log('No data found in Supabase - new user, starting fresh');
            setProgress({
              student_id: user.id,
              lesson_id: lessonId,
              video_progress: 0,
              game_completed: false,
              quiz_completed: false,
              quiz_score: 0,
              is_completed: false,
              time_spent_minutes: 0,
              last_accessed: new Date().toISOString()
            });
          } else if (error.code === 'PGRST301' || error.message?.includes('network') || error.message?.includes('timeout')) {
            // Network error - use local storage as fallback
            console.log('Network error detected, trying local storage fallback');
            try {
              const localProgress = LocalProgress.getLessonProgress(user.id, lessonId);
              if (localProgress) {
                // Convert local progress to Supabase format
                const supabaseProgress: StudentLessonProgress = {
                  student_id: user.id,
                  lesson_id: lessonId,
                  video_progress: localProgress.videoProgress,
                  game_completed: localProgress.gameCompleted,
                  quiz_completed: localProgress.quizCompleted,
                  quiz_score: localProgress.quizScore,
                  is_completed: localProgress.completed,
                  time_spent_minutes: localProgress.timeSpent || 0,
                  last_accessed: localProgress.lastAccessed || new Date().toISOString()
                };
                console.log('Loaded progress from local storage (network fallback):', supabaseProgress);
                setProgress(supabaseProgress);
              } else {
                // No local storage either, start fresh
                setProgress({
                  student_id: user.id,
                  lesson_id: lessonId,
                  video_progress: 0,
                  game_completed: false,
                  quiz_completed: false,
                  quiz_score: 0,
                  is_completed: false,
                  time_spent_minutes: 0,
                  last_accessed: new Date().toISOString()
                });
              }
            } catch (localError) {
              console.error('Error loading from local storage:', localError);
              setProgress({
                student_id: user.id,
                lesson_id: lessonId,
                video_progress: 0,
                game_completed: false,
                quiz_completed: false,
                quiz_score: 0,
                is_completed: false,
                time_spent_minutes: 0,
                last_accessed: new Date().toISOString()
              });
            }
          } else if (error.code === 'PGRST301' || error.status === 406 || error.status === 401) {
            // Authentication/RLS errors - use local storage as fallback
            console.log('Authentication/RLS error detected (406/401), using local storage fallback');
            try {
              const localProgress = LocalProgress.getLessonProgress(user.id, lessonId);
              if (localProgress) {
                // Convert local progress to Supabase format
                const supabaseProgress: StudentLessonProgress = {
                  student_id: user.id,
                  lesson_id: lessonId,
                  video_progress: localProgress.videoProgress,
                  game_completed: localProgress.gameCompleted,
                  quiz_completed: localProgress.quizCompleted,
                  quiz_score: localProgress.quizScore,
                  is_completed: localProgress.completed,
                  time_spent_minutes: localProgress.timeSpent || 0,
                  last_accessed: localProgress.lastAccessed || new Date().toISOString()
                };
                console.log('Loaded progress from local storage (auth fallback):', supabaseProgress);
                setProgress(supabaseProgress);
              } else {
                // No local storage either, start fresh
                setProgress({
                  student_id: user.id,
                  lesson_id: lessonId,
                  video_progress: 0,
                  game_completed: false,
                  quiz_completed: false,
                  quiz_score: 0,
                  is_completed: false,
                  time_spent_minutes: 0,
                  last_accessed: new Date().toISOString()
                });
              }
            } catch (localError) {
              console.error('Error loading from local storage:', localError);
              setProgress({
                student_id: user.id,
                lesson_id: lessonId,
                video_progress: 0,
                game_completed: false,
                quiz_completed: false,
                quiz_score: 0,
                is_completed: false,
                time_spent_minutes: 0,
                last_accessed: new Date().toISOString()
              });
            }
          } else {
            // For other errors, start fresh
            console.log('Other error detected, starting fresh');
            setProgress({
              student_id: user.id,
              lesson_id: lessonId,
              video_progress: 0,
              game_completed: false,
              quiz_completed: false,
              quiz_score: 0,
              is_completed: false,
              time_spent_minutes: 0,
              last_accessed: new Date().toISOString()
            });
          }
        } else {
          console.log('Loaded progress from Supabase:', data);
          const progressData = data || {
            student_id: user.id,
            lesson_id: lessonId,
            video_progress: 0,
            game_completed: false,
            quiz_completed: false,
            quiz_score: 0,
            is_completed: false,
            time_spent_minutes: 0,
            last_accessed: new Date().toISOString()
          };
          console.log('Setting progress state:', progressData);
          setProgress(progressData);
          
          // Clear local storage when Supabase data is available to prevent conflicts
          try {
            LocalProgress.clearLessonProgress(user.id, lessonId);
            console.log('Cleared local storage to sync with Supabase data');
          } catch (error) {
            console.log('Could not clear local storage:', error);
          }
        }
        setInitialized(true);
      } catch (error) {
        console.error('Error loading progress:', error);
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    } else if (!user || lessonId <= 0) {
      setLoading(false);
    }
  }, [user, lessonId, initialized]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const updateVideo = async (videoProgress: number, completed: boolean = false) => {
    if (user) {
      try {
        console.log('Updating video progress:', { videoProgress, completed, lessonId });
        const { data, error } = await LessonService.updateLessonProgress(user.id, lessonId, {
          video_progress: videoProgress,
          is_completed: completed && progress?.game_completed && progress?.quiz_completed,
          last_accessed: new Date().toISOString()
        });

        if (error) {
          console.error('Error updating video progress in Supabase:', error);
          // Only use local storage fallback for network issues, not auth issues
          if (error.code === 'PGRST116' || error.message?.includes('no rows found')) {
            try {
              LocalProgress.updateLessonProgress(user.id, lessonId, {
                videoProgress: videoProgress,
                completed: completed && progress?.game_completed && progress?.quiz_completed
              });
              console.log('Saved video progress to local storage as fallback');
              return true;
            } catch (localError) {
              console.error('Error saving to local storage:', localError);
              return false;
            }
          } else {
            // For auth errors, don't use local storage fallback
            console.log('Auth error detected, not saving to local storage');
            return false;
          }
        }

        if (data) {
          console.log('Video progress updated successfully:', data);
          setProgress(data);
          // Also save to local storage as backup
          LocalProgress.updateLessonProgress(user.id, lessonId, {
            videoProgress: data.video_progress,
            completed: data.is_completed
          });
        }
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
        const { data, error } = await LessonService.updateLessonProgress(user.id, lessonId, {
          game_completed: completed,
          is_completed: completed && progress?.video_progress >= 100 && progress?.quiz_completed,
          last_accessed: new Date().toISOString()
        });

        if (error) {
          console.error('Error updating game progress in Supabase:', error);
          // Fallback to local storage
          try {
            LocalProgress.updateLessonProgress(user.id, lessonId, {
              gameCompleted: completed,
              completed: completed && progress?.video_progress >= 100 && progress?.quiz_completed
            });
            console.log('Saved game progress to local storage as fallback');
            return true;
          } catch (localError) {
            console.error('Error saving to local storage:', localError);
            return false;
          }
        }

        if (data) {
          setProgress(data);
          // Also save to local storage as backup
          LocalProgress.updateLessonProgress(user.id, lessonId, {
            gameCompleted: data.game_completed,
            completed: data.is_completed
          });
        }
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
        const { data, error } = await LessonService.updateLessonProgress(user.id, lessonId, {
          quiz_completed: completed,
          quiz_score: score,
          is_completed: completed && progress?.video_progress >= 100 && progress?.game_completed,
          last_accessed: new Date().toISOString()
        });

        if (error) {
          console.error('Error updating quiz progress in Supabase:', error);
          // Fallback to local storage
          try {
            LocalProgress.updateLessonProgress(user.id, lessonId, {
              quizCompleted: completed,
              quizScore: score,
              completed: completed && progress?.video_progress >= 100 && progress?.game_completed
            });
            console.log('Saved quiz progress to local storage as fallback');
            return true;
          } catch (localError) {
            console.error('Error saving to local storage:', localError);
            return false;
          }
        }

        if (data) {
          setProgress(data);
          // Also save to local storage as backup
          LocalProgress.updateLessonProgress(user.id, lessonId, {
            quizCompleted: data.quiz_completed,
            quizScore: data.quiz_score,
            completed: data.is_completed
          });
        }
        return true;
      } catch (error) {
        console.error('Error updating quiz progress:', error);
        return false;
      }
    }
    return false;
  };

  const completeLesson = async (quizScore?: number) => {
    if (user) {
      try {
        const { data, error } = await LessonService.completeLesson(user.id, lessonId, quizScore);
        
        if (error) {
          console.error('Error completing lesson:', error);
          return false;
        }

        if (data) {
          setProgress(data);
          // Also save to local storage as backup
          LocalProgress.updateLessonProgress(user.id, lessonId, {
            videoProgress: data.video_progress,
            gameCompleted: data.game_completed,
            quizCompleted: data.quiz_completed,
            quizScore: data.quiz_score,
            completed: data.is_completed
          });
        }
        return true;
      } catch (error) {
        console.error('Error completing lesson:', error);
        return false;
      }
    }
    return false;
  };

  const calculateTotalProgress = (progressData: StudentLessonProgress): number => {
    let total = 0;
    if (progressData.video_progress >= 100) total += 40;
    if (progressData.game_completed) total += 30;
    if (progressData.quiz_completed) total += 30;
    return total;
  };

  const forceRefreshFromSupabase = async () => {
    setInitialized(false);
    await loadProgress();
  };

  return {
    progress,
    loading,
    updateVideo,
    updateGame,
    updateQuiz,
    completeLesson,
    refresh: loadProgress,
    forceRefreshFromSupabase,
    totalProgress: progress ? calculateTotalProgress(progress) : 0
  };
}

// Hook for getting all student progress
export function useStudentProgress() {
  const { user } = useUser();
  const [progress, setProgress] = useState<StudentLessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    if (user) {
      try {
        setLoading(true);
        const { data, error } = await LessonService.getStudentProgress(user.id);
        
        if (error) {
          console.error('Error loading student progress:', error);
        } else {
          setProgress(data || []);
        }
      } catch (error) {
        console.error('Error loading student progress:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [user]);

  const getLessonProgress = (lessonId: number): StudentLessonProgress | null => {
    return progress.find(p => p.lesson_id === lessonId) || null;
  };

  const getCompletedLessons = (): StudentLessonProgress[] => {
    return progress.filter(p => p.is_completed);
  };

  const getTotalPoints = (): number => {
    return progress.reduce((sum, p) => sum + (p.points || 0), 0);
  };

  const getAverageScore = (): number => {
    const completedLessons = getCompletedLessons();
    if (completedLessons.length === 0) return 0;
    
    const totalScore = completedLessons.reduce((sum, p) => sum + p.quiz_score, 0);
    return Math.round(totalScore / completedLessons.length);
  };

  return {
    progress,
    loading,
    getLessonProgress,
    getCompletedLessons,
    getTotalPoints,
    getAverageScore,
    refresh: loadProgress
  };
}
