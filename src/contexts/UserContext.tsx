import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error.message);
        // If profile doesn't exist, create a basic one
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          setProfile({
            id: userData.user.id,
            username: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
            role: userData.user.user_metadata?.role || 'student',
            created_at: new Date().toISOString()
          });
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to user metadata
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setProfile({
          id: userData.user.id,
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
