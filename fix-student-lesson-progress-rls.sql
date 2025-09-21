-- Fix RLS policies for student_lesson_progress table
-- This script addresses the 406 error by ensuring proper RLS policies

-- First, check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'student_lesson_progress';

-- Disable RLS temporarily to test
ALTER TABLE public.student_lesson_progress DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.student_lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.student_lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.student_lesson_progress;
DROP POLICY IF EXISTS "Users can delete own lesson progress" ON public.student_lesson_progress;

-- Create proper RLS policies
CREATE POLICY "Users can view own lesson progress" ON public.student_lesson_progress
    FOR SELECT USING (auth.uid()::text = student_id::text);

CREATE POLICY "Users can insert own lesson progress" ON public.student_lesson_progress
    FOR INSERT WITH CHECK (auth.uid()::text = student_id::text);

CREATE POLICY "Users can update own lesson progress" ON public.student_lesson_progress
    FOR UPDATE USING (auth.uid()::text = student_id::text);

CREATE POLICY "Users can delete own lesson progress" ON public.student_lesson_progress
    FOR DELETE USING (auth.uid()::text = student_id::text);

-- Re-enable RLS
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'student_lesson_progress';

-- Test query to verify it works
-- This should work after running the above policies
SELECT * FROM public.student_lesson_progress 
WHERE student_id = '50c2cfa2-efa3-4a31-a234-456c635dd369' 
AND lesson_id = 2;
