-- ==========================================
-- MASSIVE ROSTER SEED SCRIPT (6 OF EACH ROLE)
-- ==========================================
-- Run this in the Supabase SQL Editor to insert a brand new school.
-- It will populate exactly 6 School Admins, 6 Teachers, and 6 Students.
-- All users share the exact same password for testing: password123

DO $$
DECLARE
  new_school_id uuid;
BEGIN
  -- 1. Create a fresh Test School to keep things clean
  INSERT INTO public.schools (name, domain)
  VALUES ('Grand EcoLearn Academy', 'grandacademy.edu')
  RETURNING id INTO new_school_id;

  -- 2. Insert 6 School Admins 
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES 
    (gen_random_uuid(), 'Admin One|53ab39b7', 'admin1@grand.edu', 'school_admin', new_school_id),
    (gen_random_uuid(), 'Admin Two|53ab39b7', 'admin2@grand.edu', 'school_admin', new_school_id),
    (gen_random_uuid(), 'Admin Three|53ab39b7', 'admin3@grand.edu', 'school_admin', new_school_id),
    (gen_random_uuid(), 'Admin Four|53ab39b7', 'admin4@grand.edu', 'school_admin', new_school_id),
    (gen_random_uuid(), 'Admin Five|53ab39b7', 'admin5@grand.edu', 'school_admin', new_school_id),
    (gen_random_uuid(), 'Admin Six|53ab39b7', 'admin6@grand.edu', 'school_admin', new_school_id);

  -- 3. Insert 6 Teachers
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES 
    (gen_random_uuid(), 'Teacher One|53ab39b7', 'teacher1@grand.edu', 'teacher', new_school_id),
    (gen_random_uuid(), 'Teacher Two|53ab39b7', 'teacher2@grand.edu', 'teacher', new_school_id),
    (gen_random_uuid(), 'Teacher Three|53ab39b7', 'teacher3@grand.edu', 'teacher', new_school_id),
    (gen_random_uuid(), 'Teacher Four|53ab39b7', 'teacher4@grand.edu', 'teacher', new_school_id),
    (gen_random_uuid(), 'Teacher Five|53ab39b7', 'teacher5@grand.edu', 'teacher', new_school_id),
    (gen_random_uuid(), 'Teacher Six|53ab39b7', 'teacher6@grand.edu', 'teacher', new_school_id);

  -- 4. Insert 6 Students
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES 
    (gen_random_uuid(), 'Student One|53ab39b7', 'student1@grand.edu', 'student', new_school_id),
    (gen_random_uuid(), 'Student Two|53ab39b7', 'student2@grand.edu', 'student', new_school_id),
    (gen_random_uuid(), 'Student Three|53ab39b7', 'student3@grand.edu', 'student', new_school_id),
    (gen_random_uuid(), 'Student Four|53ab39b7', 'student4@grand.edu', 'student', new_school_id),
    (gen_random_uuid(), 'Student Five|53ab39b7', 'student5@grand.edu', 'student', new_school_id),
    (gen_random_uuid(), 'Student Six|53ab39b7', 'student6@grand.edu', 'student', new_school_id);

END $$;
