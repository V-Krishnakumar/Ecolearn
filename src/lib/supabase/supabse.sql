-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.achievements (
  id integer NOT NULL DEFAULT nextval('achievements_id_seq'::regclass),
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
CREATE TABLE public.activities (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
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
CREATE TABLE public.leaderboard (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
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
CREATE TABLE public.lessons (
  id integer NOT NULL DEFAULT nextval('lessons_id_seq'::regclass),
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
CREATE TABLE public.notifications (
  id integer NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
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
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text,
  created_at timestamp without time zone DEFAULT now(),
  email text NOT NULL,
  role text DEFAULT 'student'::text CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text])),
  updated_at timestamp with time zone DEFAULT now(),
  avatar_url text,
  bio text,
  total_points integer DEFAULT 0,
  level integer DEFAULT 1,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quizzes (
  id integer NOT NULL DEFAULT nextval('quizzes_id_seq'::regclass),
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
CREATE TABLE public.real_time_tasks (
  id integer NOT NULL DEFAULT nextval('real_time_tasks_id_seq'::regclass),
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
CREATE TABLE public.student_achievements (
  id integer NOT NULL DEFAULT nextval('student_achievements_id_seq'::regclass),
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
CREATE TABLE public.student_lesson_progress (
  id integer NOT NULL DEFAULT nextval('student_lesson_progress_id_seq'::regclass),
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
CREATE TABLE public.student_quiz_attempts (
  id integer NOT NULL DEFAULT nextval('student_quiz_attempts_id_seq'::regclass),
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
CREATE TABLE public.student_task_submissions (
  id integer NOT NULL DEFAULT nextval('student_task_submissions_id_seq'::regclass),
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