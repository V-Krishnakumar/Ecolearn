import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocalAuth, LocalUser } from '@/lib/localAuth';
import { UserProfile } from '@/lib/profile';
import { UserRole } from '@/lib/supabase/types';

interface UserContextType {
  user: LocalUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: LocalUser; error?: string }>;
  signUp: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; user?: LocalUser; error?: string }>;
  updateProfile: (updates: { username?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
  startDemo: (role: UserRole) => { success: boolean; user?: LocalUser; error?: string };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on app load
    const initializeAuth = () => {
      const currentUser = LocalAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Create profile object from user data
        setProfile({
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
          school_id: currentUser.school_id,
          created_at: currentUser.created_at
        });
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await LocalAuth.login({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
        setProfile({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
          school_id: result.user.school_id,
          created_at: result.user.created_at
        });
      }
      setLoading(false);
      return { ...result, user: result.user };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Login failed' };
    }
  };

  const signUp = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const result = await LocalAuth.register({ name, email, password, role });
      if (result.success && result.user) {
        setUser(result.user);
        setProfile({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
          school_id: result.user.school_id,
          created_at: result.user.created_at
        });
      }
      setLoading(false);
      return { ...result, user: result.user };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Registration failed' };
    }
  };

  const signOut = () => {
    LocalAuth.logout();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: { username?: string; email?: string }) => {
    const result = await LocalAuth.updateProfile(updates);
    if (result.success && user) {
      // Update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setProfile({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        school_id: updatedUser.school_id,
        created_at: updatedUser.created_at
      });
    }
    return result;
  };

  const startDemo = (role: UserRole) => {
    try {
      const demoUser = LocalAuth.createDemoUser(role);
      setUser(demoUser);
      setProfile({
        id: demoUser.id,
        username: demoUser.username,
        email: demoUser.email,
        role: demoUser.role,
        school_id: demoUser.school_id,
        created_at: demoUser.created_at
      });
      return { success: true, user: demoUser };
    } catch (error) {
      console.error('Demo start error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to start demo' 
      };
    }
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, signOut, signIn, signUp, updateProfile, startDemo }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
