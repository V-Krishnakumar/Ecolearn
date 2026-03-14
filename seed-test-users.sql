-- ==========================================
-- TEST USERS SEED SCRIPT
-- ==========================================
-- Run this in the Supabase SQL Editor to insert test users.
-- All users share the exact same password for testing: password123

DO $$
DECLARE
  test_school_id uuid;
BEGIN
  -- 1. Create a Test School
  INSERT INTO public.schools (name, domain)
  VALUES ('EcoLearn Test Academy', 'testacademy.edu')
  RETURNING id INTO test_school_id;

  -- 2. Insert Profiles (Hashed dynamically with EcoLearn's localAuth matching 'password123')
  
  -- PLATFORM ADMIN
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES (
    gen_random_uuid(),
    'Platform Admin|53ab39b7',
    'admin@ecolearn.com',
    'platform_admin',
    NULL
  );

  -- SCHOOL ADMIN
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES (
    gen_random_uuid(),
    'School Admin|53ab39b7',
    'school@ecolearn.com',
    'school_admin',
    test_school_id
  );

  -- TEACHERS
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES (
    gen_random_uuid(),
    'Teacher One|53ab39b7',
    'teacher1@ecolearn.com',
    'teacher',
    test_school_id
  );

  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES (
    gen_random_uuid(),
    'Teacher Two|53ab39b7',
    'teacher2@ecolearn.com',
    'teacher',
    test_school_id
  );

  -- STUDENTS
  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES (
    gen_random_uuid(),
    'Student One|53ab39b7',
    'student1@ecolearn.com',
    'student',
    test_school_id
  );

  INSERT INTO public.profiles (id, username, email, role, school_id)
  VALUES (
    gen_random_uuid(),
    'Student Two|53ab39b7',
    'student2@ecolearn.com',
    'student',
    test_school_id
  );

END $$;
