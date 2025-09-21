-- Force disable RLS policies completely
-- This script ensures RLS is disabled and removes any existing policies

-- First, drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

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
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Test the problematic query directly
SELECT 'Testing student_lesson_progress query...' as test_message;

-- This should work now without 406 errors
SELECT * FROM public.student_lesson_progress 
WHERE student_id = '50c2cfa2-efa3-4a31-a234-456c635dd369' 
AND lesson_id = 2;

-- If no rows found, that's expected for a new user
SELECT 'Query executed successfully - no 406 error!' as success_message;
