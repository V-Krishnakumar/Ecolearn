-- Clear data for a specific user
-- Replace 'YOUR_USER_ID' with the actual user ID you want to clear

-- Get the user ID from auth.users table
-- Uncomment the next line to see all user IDs:
-- SELECT id, email FROM auth.users;

-- Replace this with the actual user ID you want to clear
-- Example: '267f4cb9-d986-49d6-8bdd-342a6f9b2491'
DO $$
DECLARE
    target_user_id UUID := 'YOUR_USER_ID'; -- Replace with actual user ID
BEGIN
    -- Clear user data in the correct order
    DELETE FROM public.student_task_submissions WHERE student_id = target_user_id;
    DELETE FROM public.student_quiz_attempts WHERE student_id = target_user_id;
    DELETE FROM public.student_lesson_progress WHERE student_id = target_user_id;
    DELETE FROM public.student_achievements WHERE student_id = target_user_id;
    DELETE FROM public.activities WHERE student_id = target_user_id;
    DELETE FROM public.leaderboard WHERE student_id = target_user_id;
    DELETE FROM public.notifications WHERE student_id = target_user_id;
    DELETE FROM public.profiles WHERE id = target_user_id;
    
    -- Optional: Delete from auth.users too
    -- DELETE FROM auth.users WHERE id = target_user_id;
    
    RAISE NOTICE 'Cleared all data for user: %', target_user_id;
END $$;

-- Verify the user data is cleared
SELECT 'Data cleared for specific user' as status;
