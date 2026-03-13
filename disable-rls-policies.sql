-- Disable RLS policies for all tables
-- Run this in your Supabase SQL editor to temporarily disable RLS

-- Disable RLS for all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;

-- Optional: Add simple policies to allow all operations for testing
-- (Uncomment these if you want to keep RLS enabled but allow all access)

/*
-- Allow all operations for all tables
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.profiles FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.activities FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.leaderboard FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.lessons FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.notifications FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.quizzes FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.real_time_tasks FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.student_achievements FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.student_lesson_progress FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.student_quiz_attempts FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.student_task_submissions FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON public.achievements FOR ALL USING (true);
*/

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 'activities', 'leaderboard', 'lessons', 
    'notifications', 'quizzes', 'real_time_tasks', 
    'student_achievements', 'student_lesson_progress', 
    'student_quiz_attempts', 'student_task_submissions', 'achievements'
  )
ORDER BY tablename;
