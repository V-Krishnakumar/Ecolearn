-- Fix leaderboard duplicates and double-counting issues
-- This script will clean up duplicates and ensure proper point calculation

-- First, let's see the current state
SELECT 
  student_id, 
  COUNT(*) as entry_count, 
  SUM(total_points) as total_points_sum,
  ARRAY_AGG(id) as entry_ids
FROM leaderboard 
GROUP BY student_id 
HAVING COUNT(*) > 1
ORDER BY entry_count DESC;

-- Create a temporary table with the correct data for each user
CREATE TEMP TABLE leaderboard_cleanup AS
SELECT 
  student_id,
  SUM(total_points) as total_points,
  SUM(points) as points,
  SUM(weekly_points) as weekly_points,
  SUM(monthly_points) as monthly_points,
  MAX(updated_at) as updated_at
FROM leaderboard
GROUP BY student_id;

-- Delete all existing leaderboard entries
DELETE FROM leaderboard;

-- Insert the cleaned up entries
INSERT INTO leaderboard (student_id, total_points, points, weekly_points, monthly_points, updated_at)
SELECT 
  student_id,
  total_points,
  points,
  weekly_points,
  monthly_points,
  updated_at
FROM leaderboard_cleanup;

-- Verify the cleanup
SELECT 
  student_id, 
  total_points, 
  points,
  updated_at
FROM leaderboard 
ORDER BY total_points DESC;

-- Drop the temporary table
DROP TABLE leaderboard_cleanup;

-- Also verify that we don't have duplicate submissions
SELECT 
  student_id,
  task_id,
  COUNT(*) as submission_count
FROM student_task_submissions
GROUP BY student_id, task_id
HAVING COUNT(*) > 1;
