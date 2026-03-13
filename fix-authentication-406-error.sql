-- Comprehensive fix for 406 authentication errors
-- This addresses the issue where LocalAuth bypasses Supabase authentication

-- Option 1: Disable RLS for all tables (Quick fix for testing)
-- This allows the app to work with LocalAuth while using Supabase as a database

-- Disable RLS on all public tables
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_submissions DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Test the problematic query
SELECT * FROM public.student_lesson_progress 
WHERE student_id = '50c2cfa2-efa3-4a31-a234-456c635dd369' 
AND lesson_id = 2;

-- If you want to re-enable RLS later, use this script:
/*
-- Re-enable RLS on all tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_submissions ENABLE ROW LEVEL SECURITY;
*/
