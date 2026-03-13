// src/lib/supabaseAuth.ts
// Alternative authentication integration with Supabase
// This can be used to replace LocalAuth if you want proper Supabase authentication

import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export interface SupabaseUser {
  id: string;
  email: string;
  username?: string;
  role: 'student' | 'teacher';
  created_at: string;
}

export class SupabaseAuth {
  /**
   * Sign up with Supabase Auth
   */
  static async signUp(email: string, password: string, username: string, role: 'student' | 'teacher') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role
          }
        }
      });

      if (error) throw error;

      // Create profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            username,
            role,
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { success: true, user: data.user, error: null };
    } catch (error) {
      return { success: false, user: null, error: error.message };
    }
  }

  /**
   * Sign in with Supabase Auth
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, user: data.user, error: null };
    } catch (error) {
      return { success: false, user: null, error: error.message };
    }
  }

  /**
   * Sign out
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<SupabaseUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) return null;

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) return null;

      return {
        id: user.id,
        email: user.email!,
        username: profile.username,
        role: profile.role,
        created_at: profile.created_at
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  }
}
