// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yknfpftimrscazinxlmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbmZwZnRpbXJzY2F6aW54bG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTYyMzcsImV4cCI6MjA3MzI3MjIzN30.pbP1w_pBfOwQa3zcA8xgSRCjIvykHqKAy0Cn09UL6kw';
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Supabase client for database operations only
