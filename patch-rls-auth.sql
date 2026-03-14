-- ==============================================
-- PATCH: RLS POLICIES FOR LOCAL AUTHENTICATION
-- ==============================================
-- Run this script in the Supabase SQL Editor to fix the "Database error during login".
-- Because EcoLearn uses local authentication (localAuth.ts) instead of Supabase Auth, 
-- the client queries Supabase as an "anon" (anonymous) user to perform the login check.
-- 
-- The previous RLS policies depended on `auth.uid()`, which blocked anonymous reads,
-- causing legitimate login attempts to fail.

-- 1. Drop the restrictive profiles read policy
DROP POLICY IF EXISTS "Users can read profiles in their school" ON public.profiles;

-- 2. Create an open read policy for profiles so localAuth can select by email
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- 3. (Optional but recommended) Drop the restrictive schools read policy if it exists and causes issues
DROP POLICY IF EXISTS "Users can see their own school" ON public.schools;

-- 4. Create an open read policy for schools
CREATE POLICY "Schools are viewable by everyone" 
ON public.schools 
FOR SELECT 
USING (true);

-- 5. (Important) Ensure inserts are allowed for registration
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
CREATE POLICY "Anyone can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- 6. Ensure School Admins can update/delete their specific school's profiles (if using anon key for admin actions)
-- Note: If you want true security with localAuth, you should rely on server-side logic or 
-- switch to Supabase Auth. Since we are using localAuth entirely client-side, 
-- we must temporarily open update/delete to 'anon' as well so the Admin dashboard CRUD features work.
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;
CREATE POLICY "Anyone can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Anyone can delete profiles" ON public.profiles;
CREATE POLICY "Anyone can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (true);
