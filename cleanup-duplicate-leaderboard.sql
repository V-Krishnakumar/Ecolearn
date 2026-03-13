-- Clean up duplicate leaderboard entries
-- This script will keep only the latest entry for each student and sum their points

-- First, let's see what we have
SELECT student_id, COUNT(*) as entry_count, SUM(total_points) as total_points_sum
FROM leaderboard 
GROUP BY student_id 
HAVING COUNT(*) > 1
ORDER BY entry_count DESC;

-- Create a temporary table with the latest entry for each student
CREATE TEMP TABLE latest_leaderboard AS
SELECT DISTINCT ON (student_id)
  student_id,
  total_points,
  points,
  weekly_points,
  monthly_points,
  updated_at
FROM leaderboard
ORDER BY student_id, updated_at DESC;

-- Delete all existing entries
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
FROM latest_leaderboard;

-- Verify the cleanup
SELECT 
  student_id, 
  total_points, 
  points,
  updated_at
FROM leaderboard 
ORDER BY total_points DESC;

-- Drop the temporary table
DROP TABLE latest_leaderboard;
