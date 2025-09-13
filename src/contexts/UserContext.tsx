import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocalAuth, LocalUser } from '@/lib/localAuth';
import { UserProfile } from '@/lib/profile';

interface UserContextType {
  user: LocalUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: { username?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
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
          created_at: result.user.created_at
        });
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Login failed' };
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await LocalAuth.register({ name, email, password });
      if (result.success && result.user) {
        setUser(result.user);
        setProfile({
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          created_at: result.user.created_at
        });
      }
      setLoading(false);
      return result;
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
        created_at: updatedUser.created_at
      });
    }
    return result;
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, signOut, signIn, signUp, updateProfile }}>
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
