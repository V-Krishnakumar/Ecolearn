import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ensureUserProfile, fetchUserProfile } from '@/lib/profile';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Use the ensureUserProfile utility which handles creation if needed
      const profile = await ensureUserProfile(userId);
      
      if (profile) {
        setProfile(profile);
      } else {
        // Fallback to user metadata if profile creation fails
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const fallbackProfile = {
            id: userId,
            username: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
            role: userData.user.user_metadata?.role || 'student',
            created_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Final fallback
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setProfile({
          id: userId,
          username: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
          role: userData.user.user_metadata?.role || 'student',
          created_at: new Date().toISOString()
        });
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
