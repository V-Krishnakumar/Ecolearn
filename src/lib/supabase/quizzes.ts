// src/lib/supabase/quizzes.ts
import { supabase } from '../supabase';
import { 
  Quiz, 
  StudentQuizAttempt, 
  QueryResult, 
  QueryResultArray,
  StudentQuizAttemptWithDetails
} from './types';

export class QuizService {
  /**
   * Get quizzes for a specific lesson
   */
  static async getQuizzesByLesson(lessonId: number): Promise<QueryResultArray<Quiz>> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get a specific quiz by ID
   */
  static async getQuizById(quizId: number): Promise<QueryResult<Quiz>> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Submit a quiz attempt
   */
  static async submitQuizAttempt(
    studentId: string,
    quizId: number,
    selectedAnswer: number
  ): Promise<QueryResult<StudentQuizAttempt>> {
    try {
      // First get the quiz to check the correct answer
      const { data: quiz, error: quizError } = await this.getQuizById(quizId);
      if (quizError || !quiz) {
        return { data: null, error: quizError || 'Quiz not found' };
      }

      const isCorrect = selectedAnswer === quiz.correct_answer;
      const pointsEarned = isCorrect ? quiz.points : 0;

      // Create the quiz attempt
      const { data, error } = await supabase
        .from('student_quiz_attempts')
        .insert({
          student_id: studentId,
          quiz_id: quizId,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          points_earned: pointsEarned,
          attempted_at: new Date().toISOString()
        })
        .select()
        .single();

      // Log activity if correct
      if (isCorrect && !error) {
        await this.logActivity(studentId, 'quiz_completed', {
          quiz_id: quizId,
          points_earned: pointsEarned,
          is_correct: isCorrect
        }, pointsEarned);
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get student's quiz attempts for a specific lesson
   */
  static async getStudentQuizAttempts(
    studentId: string, 
    lessonId: number
  ): Promise<QueryResultArray<StudentQuizAttemptWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('student_quiz_attempts')
        .select(`
          *,
          quiz:quizzes (
            id,
            question,
            options,
            correct_answer,
            explanation,
            points,
            lesson_id
          )
        `)
        .eq('student_id', studentId)
        .eq('quiz.lesson_id', lessonId)
        .order('attempted_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get all quiz attempts for a student
   */
  static async getAllStudentQuizAttempts(
    studentId: string
  ): Promise<QueryResultArray<StudentQuizAttemptWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('student_quiz_attempts')
        .select(`
          *,
          quiz:quizzes (
            id,
            question,
            options,
            correct_answer,
            explanation,
            points,
            lesson_id
          )
        `)
        .eq('student_id', studentId)
        .order('attempted_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get quiz statistics for a student
   */
  static async getQuizStats(studentId: string): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    totalPoints: number;
    averageScore: number;
    accuracy: number;
  }> {
    try {
      const { data: attempts } = await this.getAllStudentQuizAttempts(studentId);

      if (!attempts || attempts.length === 0) {
        return {
          totalAttempts: 0,
          correctAttempts: 0,
          totalPoints: 0,
          averageScore: 0,
          accuracy: 0
        };
      }

      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter(a => a.is_correct).length;
      const totalPoints = attempts.reduce((sum, a) => sum + a.points_earned, 0);
      const averageScore = totalPoints / totalAttempts;
      const accuracy = (correctAttempts / totalAttempts) * 100;

      return {
        totalAttempts,
        correctAttempts,
        totalPoints,
        averageScore: Math.round(averageScore),
        accuracy: Math.round(accuracy)
      };
    } catch (error) {
      console.error('Error getting quiz stats:', error);
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        totalPoints: 0,
        averageScore: 0,
        accuracy: 0
      };
    }
  }

  /**
   * Get quiz statistics for a specific lesson
   */
  static async getLessonQuizStats(studentId: string, lessonId: number): Promise<{
    totalQuizzes: number;
    attemptedQuizzes: number;
    correctQuizzes: number;
    totalPoints: number;
    averageScore: number;
    accuracy: number;
  }> {
    try {
      const { data: quizzes } = await this.getQuizzesByLesson(lessonId);
      const { data: attempts } = await this.getStudentQuizAttempts(studentId, lessonId);

      const totalQuizzes = quizzes?.length || 0;
      const attemptedQuizzes = attempts?.length || 0;
      const correctQuizzes = attempts?.filter(a => a.is_correct).length || 0;
      const totalPoints = attempts?.reduce((sum, a) => sum + a.points_earned, 0) || 0;
      const averageScore = attemptedQuizzes > 0 ? totalPoints / attemptedQuizzes : 0;
      const accuracy = attemptedQuizzes > 0 ? (correctQuizzes / attemptedQuizzes) * 100 : 0;

      return {
        totalQuizzes,
        attemptedQuizzes,
        correctQuizzes,
        totalPoints,
        averageScore: Math.round(averageScore),
        accuracy: Math.round(accuracy)
      };
    } catch (error) {
      console.error('Error getting lesson quiz stats:', error);
      return {
        totalQuizzes: 0,
        attemptedQuizzes: 0,
        correctQuizzes: 0,
        totalPoints: 0,
        averageScore: 0,
        accuracy: 0
      };
    }
  }

  /**
   * Check if student has completed all quizzes for a lesson
   */
  static async hasCompletedAllQuizzes(studentId: string, lessonId: number): Promise<boolean> {
    try {
      const { data: quizzes } = await this.getQuizzesByLesson(lessonId);
      const { data: attempts } = await this.getStudentQuizAttempts(studentId, lessonId);

      if (!quizzes || quizzes.length === 0) {
        return true; // No quizzes to complete
      }

      const attemptedQuizIds = new Set(attempts?.map(a => a.quiz_id) || []);
      return quizzes.every(quiz => attemptedQuizIds.has(quiz.id));
    } catch (error) {
      console.error('Error checking quiz completion:', error);
      return false;
    }
  }

  /**
   * Get perfect quiz attempts (100% correct for a lesson)
   */
  static async getPerfectQuizAttempts(studentId: string): Promise<QueryResultArray<StudentQuizAttemptWithDetails>> {
    try {
      const { data: attempts } = await this.getAllStudentQuizAttempts(studentId);

      if (!attempts) {
        return { data: [], error: null };
      }

      // Group attempts by lesson
      const attemptsByLesson = attempts.reduce((acc, attempt) => {
        const lessonId = attempt.quiz?.lesson_id;
        if (lessonId) {
          if (!acc[lessonId]) {
            acc[lessonId] = [];
          }
          acc[lessonId].push(attempt);
        }
        return acc;
      }, {} as Record<number, StudentQuizAttemptWithDetails[]>);

      // Find lessons where all quizzes were answered correctly
      const perfectLessons = Object.values(attemptsByLesson).filter(lessonAttempts => {
        return lessonAttempts.every(attempt => attempt.is_correct);
      });

      const perfectAttempts = perfectLessons.flat();

      return { data: perfectAttempts, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Log activity for points and achievements
   */
  private static async logActivity(
    studentId: string,
    activityType: string,
    metadata: any,
    points: number = 0
  ): Promise<void> {
    try {
      await supabase
        .from('activities')
        .insert({
          student_id: studentId,
          activity_type: activityType,
          points_earned: points,
          metadata: metadata,
          description: this.getActivityDescription(activityType, metadata)
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Get activity description
   */
  private static getActivityDescription(activityType: string, metadata: any): string {
    switch (activityType) {
      case 'quiz_completed':
        return `Completed quiz with ${metadata.is_correct ? 'correct' : 'incorrect'} answer (+${metadata.points_earned} points)`;
      default:
        return `Activity: ${activityType}`;
    }
  }
}
