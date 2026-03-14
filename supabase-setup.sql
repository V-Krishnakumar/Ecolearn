-- ==============================================
-- ECOLEARN - COMPLETE SUPABASE DATABASE SETUP
-- ==============================================
-- Run this ENTIRE script in the Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste & Run
-- ==============================================

-- ==================
-- 1. SCHOOLS TABLE (SAAS TENANT)
-- ==================
CREATE TABLE public.schools (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  domain text UNIQUE,
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'suspended')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ==================
-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  username text,
  created_at timestamp without time zone DEFAULT now(),
  email text NOT NULL,
  role text DEFAULT 'student'::text CHECK (role = ANY (ARRAY['platform_admin'::text, 'school_admin'::text, 'teacher'::text, 'student'::text, 'independent_student'::text])),
  updated_at timestamp with time zone DEFAULT now(),
  avatar_url text,
  bio text,
  total_points integer DEFAULT 0,
  level integer DEFAULT 1,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- ==================
-- 2. LESSONS TABLE
-- ==================
CREATE TABLE public.lessons (
  id serial NOT NULL,
  title text NOT NULL,
  description text,
  content text,
  video_url text,
  duration_minutes integer DEFAULT 15,
  difficulty text DEFAULT 'beginner'::text CHECK (difficulty = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  category text NOT NULL,
  points integer DEFAULT 50,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lessons_pkey PRIMARY KEY (id)
);

-- ==================
-- 3. QUIZZES TABLE
-- ==================
CREATE TABLE public.quizzes (
  id serial NOT NULL,
  lesson_id integer,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text,
  points integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);

-- ==================
-- 4. ACHIEVEMENTS TABLE
-- ==================
CREATE TABLE public.achievements (
  id serial NOT NULL,
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text,
  points integer DEFAULT 0,
  category text,
  rarity text DEFAULT 'common'::text CHECK (rarity = ANY (ARRAY['common'::text, 'rare'::text, 'epic'::text, 'legendary'::text])),
  requirements jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT achievements_pkey PRIMARY KEY (id)
);

-- ==================
-- 5. REAL TIME TASKS TABLE
-- ==================
CREATE TABLE public.real_time_tasks (
  id serial NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  instructions text,
  category text NOT NULL,
  difficulty text DEFAULT 'beginner'::text CHECK (difficulty = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  points integer DEFAULT 50,
  time_estimate_minutes integer DEFAULT 30,
  max_participants integer,
  is_active boolean DEFAULT true,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT real_time_tasks_pkey PRIMARY KEY (id)
);

-- ==================
-- 6. ACTIVITIES TABLE
-- ==================
CREATE TABLE public.activities (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid,
  type text,
  points integer,
  created_at timestamp without time zone DEFAULT now(),
  activity_type text,
  points_earned integer DEFAULT 0,
  description text,
  metadata jsonb,
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_user_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);

-- ==================
-- 7. LEADERBOARD TABLE
-- ==================
CREATE TABLE public.leaderboard (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid,
  points integer DEFAULT 0,
  updated_at timestamp without time zone DEFAULT now(),
  total_points integer DEFAULT 0,
  weekly_points integer DEFAULT 0,
  monthly_points integer DEFAULT 0,
  rank_position integer,
  CONSTRAINT leaderboard_pkey PRIMARY KEY (id),
  CONSTRAINT leaderboard_user_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);

-- ==================
-- 8. NOTIFICATIONS TABLE
-- ==================
CREATE TABLE public.notifications (
  id serial NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info'::text CHECK (type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text, 'achievement'::text])),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);

-- ==================
-- 9. STUDENT LESSON PROGRESS TABLE
-- ==================
CREATE TABLE public.student_lesson_progress (
  id serial NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid,
  lesson_id integer,
  video_progress integer DEFAULT 0 CHECK (video_progress >= 0 AND video_progress <= 100),
  game_completed boolean DEFAULT false,
  quiz_completed boolean DEFAULT false,
  quiz_score integer DEFAULT 0 CHECK (quiz_score >= 0 AND quiz_score <= 100),
  is_completed boolean DEFAULT false,
  time_spent_minutes integer DEFAULT 0,
  last_accessed timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  points integer DEFAULT 0,
  CONSTRAINT student_lesson_progress_pkey PRIMARY KEY (id),
  CONSTRAINT student_lesson_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id),
  CONSTRAINT student_lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);

-- ==================
-- 10. STUDENT QUIZ ATTEMPTS TABLE
-- ==================
CREATE TABLE public.student_quiz_attempts (
  id serial NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid,
  quiz_id integer,
  selected_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  points_earned integer DEFAULT 0,
  attempted_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT student_quiz_attempts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id),
  CONSTRAINT student_quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
);

-- ==================
-- 11. STUDENT ACHIEVEMENTS TABLE
-- ==================
CREATE TABLE public.student_achievements (
  id serial NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid,
  achievement_id integer,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_unlocked boolean DEFAULT false,
  unlocked_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT student_achievements_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id),
  CONSTRAINT student_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id)
);

-- ==================
-- 12. STUDENT TASK SUBMISSIONS TABLE
-- ==================
CREATE TABLE public.student_task_submissions (
  id serial NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid,
  task_id integer,
  submission_type text NOT NULL CHECK (submission_type = ANY (ARRAY['image'::text, 'video'::text, 'text'::text, 'document'::text])),
  submission_data jsonb NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  points_earned integer DEFAULT 0,
  feedback text,
  submitted_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  CONSTRAINT student_task_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT student_task_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id),
  CONSTRAINT student_task_submissions_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.real_time_tasks(id),
  CONSTRAINT student_task_submissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_submissions ENABLE ROW LEVEL SECURITY;

-- 1. GLOBAL READ-ONLY (Lessons, Quizzes, Tasks, Achievements)
-- Anyone authenticated can read the core curriculum
CREATE POLICY "Anyone can read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can read quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can read tasks" ON public.real_time_tasks FOR SELECT USING (true);

-- 2. SCHOOL TENANT ACCESS
CREATE POLICY "Platform admins can see all schools" ON public.schools FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin')
);
CREATE POLICY "Users can see their own school" ON public.schools FOR SELECT USING (
  id IN (SELECT school_id FROM public.profiles WHERE profiles.id = auth.uid())
);

-- 3. PROFILES ACCESS
CREATE POLICY "Users can read profiles in their school" ON public.profiles FOR SELECT USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()) OR auth.uid() = id
);
CREATE POLICY "Platform admins manage all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin')
);
CREATE POLICY "School admins manage school profiles" ON public.profiles FOR ALL USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid() AND role = 'school_admin')
);

-- 4. TENANT ISOLATED DATA (Progress, Activities, Submissions, Leaderboard, Notifications)
-- Students see their own. Teachers/Admins see their school's. Platform Admins see all.

-- Activities
CREATE POLICY "Students see own activities" ON public.activities FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Staff see school activities" ON public.activities FOR SELECT USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'school_admin'))
);
CREATE POLICY "Platform admin activities" ON public.activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'platform_admin')
);
CREATE POLICY "System insert activities" ON public.activities FOR INSERT WITH CHECK (true); -- For demo/local auth bypass

-- Student Lesson Progress
CREATE POLICY "Students see own progress" ON public.student_lesson_progress FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Staff see school progress" ON public.student_lesson_progress FOR SELECT USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'school_admin'))
);
CREATE POLICY "System insert/update progress" ON public.student_lesson_progress FOR ALL USING (true); -- Relaxed for demo auth

-- Student Task Submissions
CREATE POLICY "Students see own submissions" ON public.student_task_submissions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Staff see school submissions" ON public.student_task_submissions FOR SELECT USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'school_admin'))
);
CREATE POLICY "System insert/update submissions" ON public.student_task_submissions FOR ALL USING (true); -- Relaxed for demo auth

-- Leaderboard
CREATE POLICY "Users see school leaderboard" ON public.leaderboard FOR SELECT USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "System update leaderboard" ON public.leaderboard FOR ALL USING (true); -- Relaxed for demo auth

-- Notifications
CREATE POLICY "Students see own notifications" ON public.notifications FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "System update notifications" ON public.notifications FOR ALL USING (true); -- Relaxed for demo auth

-- Student Achievements
CREATE POLICY "Students see own achievements" ON public.student_achievements FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "System update student achievements" ON public.student_achievements FOR ALL USING (true); -- Relaxed for demo auth
CREATE POLICY "Staff see school student achievements" ON public.student_achievements FOR SELECT USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'school_admin'))
);

-- Student Quiz Attempts
CREATE POLICY "Students see own quiz attempts" ON public.student_quiz_attempts FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "System update quiz attempts" ON public.student_quiz_attempts FOR ALL USING (true); -- Relaxed for demo auth
CREATE POLICY "Staff see school quiz attempts" ON public.student_quiz_attempts FOR SELECT USING (
  school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'school_admin'))
);

-- ==============================================
-- SEED DATA: LESSONS
-- ==============================================

INSERT INTO public.lessons (title, description, content, video_url, duration_minutes, difficulty, category, points) VALUES
('Waste Management', 'Learn about proper waste disposal, recycling, and composting to reduce environmental impact.', 'Waste management involves the collection, transportation, processing, recycling, and disposal of waste materials. Proper waste management helps reduce pollution, conserve resources, and protect human health.', '/videos/Waste Management.mp4', 15, 'beginner', 'Waste Management', 50),
('Water Treatment', 'Discover how water is cleaned and purified for safe consumption and environmental protection.', 'Water treatment is the process of removing contaminants from water to make it safe for drinking, industrial use, or environmental release. Modern treatment plants use multiple stages including filtration, sedimentation, and disinfection.', '/videos/Water Treatment.mp4', 12, 'beginner', 'Water Conservation', 50),
('Pollution-Free Zones', 'Explore strategies to create and maintain clean, pollution-free environments in cities.', 'Pollution-free zones are designated areas where strict measures are implemented to minimize air, water, and noise pollution. These zones promote sustainable transportation, green energy, and eco-friendly practices.', '/videos/Pollution - Free Zones.mp4', 18, 'intermediate', 'Pollution Control', 75),
('Afforestation', 'Understand the importance of planting trees and creating new forests for our planet.', 'Afforestation is the process of planting trees in an area where there was no previous tree cover. It helps combat climate change, prevent soil erosion, and create habitats for wildlife.', '/videos/Afforestation.mp4', 14, 'beginner', 'Forest Conservation', 50),
('Deforestation', 'Learn about the causes and effects of deforestation and how to prevent it.', 'Deforestation is the permanent removal of trees and forests. It leads to loss of biodiversity, climate change, and soil degradation. Understanding deforestation helps us take action to protect our forests.', '/videos/Deforestation.mp4', 16, 'intermediate', 'Forest Conservation', 75),
('Renewable Energy', 'Discover clean energy sources like solar, wind, and hydroelectric power for a sustainable future.', 'Renewable energy comes from natural sources that are constantly replenished, such as sunlight, wind, rain, tides, and geothermal heat. Transitioning to renewable energy is crucial for reducing greenhouse gas emissions.', '/videos/Renewable Energy.mp4', 20, 'advanced', 'Clean Energy', 100);

-- ==============================================
-- SEED DATA: REAL-TIME TASKS
-- ==============================================

INSERT INTO public.real_time_tasks (title, description, instructions, category, difficulty, points, time_estimate_minutes, is_active) VALUES
('Plant a Tree', 'Plant a tree or sapling in your community and document the process with a photo.', 'Step 1: Get a sapling from a nursery. Step 2: Find a suitable location. Step 3: Dig a hole, plant the sapling, and water it. Step 4: Take a photo as evidence.', 'Afforestation', 'beginner', 50, 30, true),
('Community Cleanup Drive', 'Organize or participate in a community cleanup event in your neighborhood.', 'Step 1: Gather volunteers. Step 2: Collect trash bags and gloves. Step 3: Clean up a public area. Step 4: Document the before and after with photos.', 'Waste Management', 'intermediate', 75, 120, true),
('Home Waste Audit', 'Conduct a waste audit of your household to identify waste reduction opportunities.', 'Step 1: Collect all waste for a day. Step 2: Sort into categories (recyclable, compostable, landfill). Step 3: Weigh each category. Step 4: Create a reduction plan.', 'Waste Management', 'advanced', 100, 180, true),
('Water Conservation Challenge', 'Track and reduce your household water usage for one week.', 'Step 1: Record current water usage. Step 2: Implement water-saving measures. Step 3: Track daily usage. Step 4: Report savings after one week.', 'Water Conservation', 'intermediate', 60, 60, true),
('Energy Efficiency Audit', 'Assess your home energy consumption and implement efficiency improvements.', 'Step 1: List all electronic devices. Step 2: Check energy ratings. Step 3: Identify energy-wasting habits. Step 4: Implement changes and document results.', 'Energy Conservation', 'advanced', 80, 240, true);

-- ==============================================
-- DONE! All tables, policies, and seed data created.
-- ==============================================
