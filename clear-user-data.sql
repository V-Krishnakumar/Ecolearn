-- Clear all user data from Supabase tables
-- This will delete all user progress, activities, and personal data
-- but keep the website data (lessons, achievements, quizzes, etc.)

-- WARNING: This will permanently delete all user data!
-- Make sure you want to do this before running.

-- Clear user-related data in the correct order (respecting foreign keys)

-- 1. Clear student task submissions
DELETE FROM public.student_task_submissions;

-- 2. Clear student quiz attempts
DELETE FROM public.student_quiz_attempts;

-- 3. Clear student lesson progress
DELETE FROM public.student_lesson_progress;

-- 4. Clear student achievements
DELETE FROM public.student_achievements;

-- 5. Clear activities
DELETE FROM public.activities;

-- 6. Clear leaderboard
DELETE FROM public.leaderboard;

-- 7. Clear notifications
DELETE FROM public.notifications;

-- 8. Clear profiles (this will also clear auth.users if you want)
-- Uncomment the next line if you want to clear user accounts too:
-- DELETE FROM auth.users;

-- 9. Clear profiles (keep this to clear user profiles)
DELETE FROM public.profiles;

-- Verify all user data is cleared
SELECT 'User data cleared. Remaining records:' as status;

SELECT 'profiles' as table_name, COUNT(*) as record_count FROM public.profiles
UNION ALL
SELECT 'activities' as table_name, COUNT(*) as record_count FROM public.activities
UNION ALL
SELECT 'leaderboard' as table_name, COUNT(*) as record_count FROM public.leaderboard
UNION ALL
SELECT 'student_lesson_progress' as table_name, COUNT(*) as record_count FROM public.student_lesson_progress
UNION ALL
SELECT 'student_achievements' as table_name, COUNT(*) as record_count FROM public.student_achievements
UNION ALL
SELECT 'student_quiz_attempts' as table_name, COUNT(*) as record_count FROM public.student_quiz_attempts
UNION ALL
SELECT 'student_task_submissions' as table_name, COUNT(*) as record_count FROM public.student_task_submissions
UNION ALL
SELECT 'notifications' as table_name, COUNT(*) as record_count FROM public.notifications;

-- Show that website data is preserved
SELECT 'Website data preserved:' as status;

SELECT 'lessons' as table_name, COUNT(*) as record_count FROM public.lessons
UNION ALL
SELECT 'achievements' as table_name, COUNT(*) as record_count FROM public.achievements
UNION ALL
SELECT 'quizzes' as table_name, COUNT(*) as record_count FROM public.quizzes
UNION ALL
SELECT 'real_time_tasks' as table_name, COUNT(*) as record_count FROM public.real_time_tasks;
