// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://facrwsbqgesgqjbcdfss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY3J3c2JxZ2VzZ3FqYmNkZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTM3OTksImV4cCI6MjA4ODk4OTc5OX0.E0Ax-JBemQARCnaFZ2HBjA_zFAsYq7MSlElgmAagPRo';
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Supabase client for database operations only
