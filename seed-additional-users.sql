-- ==========================================
-- ADDITIONAL TEST USERS SCRIPT
-- ==========================================
-- This script adds 4 more students and 2 more teachers 
-- to the "EcoLearn Test Academy" you created previously.
-- 
-- Password for all of them remains: password123

DO $$
DECLARE
  target_school_id uuid;
BEGIN
  -- 1. Look up the school we created in the first script
  SELECT id INTO target_school_id 
  FROM public.schools 
  WHERE name = 'EcoLearn Test Academy' 
  LIMIT 1;

  IF target_school_id IS NULL THEN
    RAISE EXCEPTION 'Could not find EcoLearn Test Academy. Please make sure the previous script ran successfully.';
  END IF;

  -- 2. Insert 4 MORE Students (making 6 total)
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES 
    (gen_random_uuid(), 'Student Three|53ab39b7', 'student3@ecolearn.com', 'student', target_school_id),
    (gen_random_uuid(), 'Student Four|53ab39b7', 'student4@ecolearn.com', 'student', target_school_id),
    (gen_random_uuid(), 'Student Five|53ab39b7', 'student5@ecolearn.com', 'student', target_school_id),
    (gen_random_uuid(), 'Student Six|53ab39b7', 'student6@ecolearn.com', 'student', target_school_id);

  -- 3. Insert 2 MORE Teachers (making 4 total)
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES 
    (gen_random_uuid(), 'Teacher Three|53ab39b7', 'teacher3@ecolearn.com', 'teacher', target_school_id),
    (gen_random_uuid(), 'Teacher Four|53ab39b7', 'teacher4@ecolearn.com', 'teacher', target_school_id);

END $$;
