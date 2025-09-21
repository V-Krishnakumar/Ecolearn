-- Approve all pending task submissions and award points
-- This script can be run in Supabase SQL editor to approve submissions

-- First, let's see what pending submissions we have
SELECT 
  sts.id,
  sts.student_id,
  sts.task_id,
  sts.status,
  sts.points_earned,
  sts.submitted_at,
  rt.title as task_title,
  rt.points as task_points
FROM student_task_submissions sts
LEFT JOIN real_time_tasks rt ON sts.task_id = rt.id
WHERE sts.status = 'pending'
ORDER BY sts.submitted_at DESC;

-- Update all pending submissions to approved and award points
UPDATE student_task_submissions 
SET 
  status = 'approved',
  points_earned = COALESCE(
    (SELECT points FROM real_time_tasks WHERE id = student_task_submissions.task_id), 
    50
  )
WHERE status = 'pending';

-- Verify the updates
SELECT 
  sts.id,
  sts.student_id,
  sts.task_id,
  sts.status,
  sts.points_earned,
  sts.submitted_at,
  rt.title as task_title
FROM student_task_submissions sts
LEFT JOIN real_time_tasks rt ON sts.task_id = rt.id
WHERE sts.status = 'approved'
ORDER BY sts.submitted_at DESC;

-- Update leaderboard with the new points
-- This will add the points to each user's total
UPDATE leaderboard 
SET 
  total_points = total_points + (
    SELECT COALESCE(SUM(points_earned), 0) 
    FROM student_task_submissions 
    WHERE student_id = leaderboard.student_id 
    AND status = 'approved'
  )
WHERE student_id IN (
  SELECT DISTINCT student_id 
  FROM student_task_submissions 
  WHERE status = 'approved'
);

-- Verify leaderboard updates
SELECT 
  l.student_id,
  l.total_points,
  p.username
FROM leaderboard l
LEFT JOIN profiles p ON l.student_id = p.id
ORDER BY l.total_points DESC;
