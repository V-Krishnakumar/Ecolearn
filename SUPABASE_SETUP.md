# Supabase Setup Instructions

## Issue Fixed: Username Not Saving in Profile Table

The issue where usernames were showing as `null` in the Supabase profile table has been resolved with the following improvements:

### 🔧 **Code Changes Made**

1. **Enhanced Auth Component** (`src/pages/Auth.tsx`)
   - Improved error handling for profile creation
   - Added proper success/failure feedback
   - Uses new profile utility functions

2. **New Profile Utility** (`src/lib/profile.ts`)
   - `createUserProfile()` - Creates user profiles with proper error handling
   - `fetchUserProfile()` - Retrieves user profiles
   - `updateUserProfile()` - Updates existing profiles
   - `ensureUserProfile()` - Ensures profile exists, creates if missing

3. **Updated UserContext** (`src/contexts/UserContext.tsx`)
   - Uses new profile utilities for better reliability
   - Improved fallback mechanisms
   - Better error handling and logging

### 🗄️ **Database Setup Required**

**IMPORTANT**: You need to run the SQL script in your Supabase dashboard to fix the database structure and policies.

#### Steps to Fix Database:

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**

2. **Run the Quick Fix Script FIRST** (if you got the "role column does not exist" error):
   - Copy the contents of `fix-profiles-table.sql`
   - Paste into the SQL Editor
   - Click **Run** to execute
   - This will add missing columns to your existing table

3. **Then Run the Full Setup Script**:
   - Copy the contents of `supabase-setup.sql`
   - Paste into the SQL Editor
   - Click **Run** to execute

4. **What the Scripts Do**:
   - **Quick Fix**: Adds missing columns (username, role, created_at, updated_at) to existing table
   - **Full Setup**: Creates the `profiles` table if it doesn't exist, sets up RLS policies, creates triggers, adds indexes, grants permissions

#### ⚠️ **If You Got "column role does not exist" Error**:
This means your existing profiles table is missing some columns. Use the `fix-profiles-table.sql` script first to add the missing columns safely.

### 🔄 **How It Works Now**

1. **User Registration**:
   - User signs up with name, email, password
   - Profile is created immediately after successful signup
   - Username is saved from the name field

2. **Profile Creation**:
   - Primary: Direct insertion into profiles table
   - Fallback: Uses user metadata if profile creation fails
   - Automatic: Database trigger creates profile on user creation

3. **Profile Retrieval**:
   - Tries to fetch from profiles table first
   - If not found, attempts to create one
   - Falls back to user metadata as last resort

### 🧪 **Testing the Fix**

1. **Register a New User**:
   - Go to `/auth`
   - Fill out registration form with a name
   - Submit registration

2. **Check Profile Creation**:
   - Check browser console for success messages
   - Verify in Supabase dashboard that profile exists
   - Username should now be populated correctly

3. **Login and Verify**:
   - Login with the new account
   - Check that username appears in navigation
   - Verify profile data is loaded correctly

### 🚨 **Troubleshooting**

If you still see `null` usernames:

1. **Check Database Setup**:
   - Ensure you ran the `supabase-setup.sql` script
   - Verify RLS policies are enabled
   - Check that the trigger was created

2. **Check Console Logs**:
   - Look for profile creation errors
   - Verify authentication flow is working
   - Check for network errors

3. **Manual Profile Creation**:
   - If automatic creation fails, profiles will be created on first login
   - The system has multiple fallback mechanisms

### 📝 **Database Schema**

The `profiles` table structure:
```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 🔐 **Security Features**

- Row Level Security enabled
- Users can only access their own profiles
- Automatic profile creation via database triggers
- Proper error handling and fallbacks

The fix ensures that usernames are properly saved and displayed throughout the application!
