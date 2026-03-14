// src/lib/localAuth.ts
import { supabase } from './supabase';
import { createUserProfile, fetchUserProfile, updateUserProfile, UserProfile } from './profile';
import { UserRole } from './supabase/types';

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  school_id?: string;
  created_at: string;
  total_points?: number;
  level?: number;
  avatar_url?: string;
  bio?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  school_id?: string;
}

/**
 * Local authentication system that works with profile table only
 * No email verification required
 */
export class LocalAuth {
  private static readonly STORAGE_KEY = 'ecolearn_user';

  /**
   * Register a new user (creates profile directly)
   */
  static async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: LocalUser; error?: string }> {
    try {
      // Check if user already exists by email
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', credentials.email);

      if (checkError) {
        console.error('Error checking existing profiles:', checkError);
        return { success: false, error: 'Database error during registration' };
      }

      if (existingProfiles && existingProfiles.length > 0) {
        return { success: false, error: 'An account with this email already exists. Please login instead.' };
      }

      // Generate a simple UUID for the user
      const userId = this.generateUserId();
      
      // Hash the password for storage
      const hashedPassword = this.hashPassword(credentials.password);
      
      // Create profile with separate email and username fields
      const profileResult = await createUserProfile(
        userId, 
        credentials.name.trim(), // Store full name in username
        credentials.email.trim(),  // Store email in email field
        credentials.role, // Store user role
        credentials.school_id // Store school_id if available
      );
      
      if (!profileResult.success) {
        return { success: false, error: profileResult.error };
      }

      // Store hashed password in a separate field (we'll add this to the schema)
      // For now, we'll store it in the username field temporarily
      // TODO: Add password_hash column to profiles table
      const { error: passwordError } = await supabase
        .from('profiles')
        .update({ username: `${credentials.name.trim()}|${hashedPassword}` })
        .eq('id', userId);

      if (passwordError) {
        console.error('Error storing password:', passwordError);
        return { success: false, error: 'Failed to store password securely' };
      }

      // Create local user object
      const user: LocalUser = {
        id: userId,
        username: credentials.name.trim(), // Display name
        email: credentials.email,
        role: credentials.role,
        school_id: credentials.school_id,
        created_at: new Date().toISOString()
      };

      // Store user in localStorage
      this.setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  /**
   * Login with email and password (validates against existing profiles)
   */
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: LocalUser; error?: string }> {
    try {
      // Find the user by email
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', credentials.email);

      if (error) {
        console.error('Error fetching profiles:', error);
        return { success: false, error: 'Database error during login' };
      }

      if (!profiles || profiles.length === 0) {
        return { success: false, error: 'No account found with this email. Please register first.' };
      }

      const profile = profiles[0];
      
      // Extract username and hashed password from username field
      const [storedUsername, storedHashedPassword] = profile.username.split('|');
      
      if (!storedHashedPassword) {
        return { success: false, error: 'Invalid account data. Please register again.' };
      }

      // Verify password
      const hashedInputPassword = this.hashPassword(credentials.password);
      if (hashedInputPassword !== storedHashedPassword) {
        return { success: false, error: 'Invalid email or password.' };
      }

      // Create local user object
      const user: LocalUser = {
        id: profile.id,
        username: storedUsername, // Display name
        email: profile.email,
        role: (profile.role as UserRole) || 'student', // Default to student if no role
        school_id: profile.school_id,
        created_at: profile.created_at
      };

      // Store user in localStorage
      this.setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): LocalUser | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Logout user (clear localStorage)
   */
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: { username?: string; email?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      // Update profile in database
      const result = await updateUserProfile(currentUser.id, updates);
      
      if (result.success) {
        // Update local user
        const updatedUser = { ...currentUser, ...updates };
        this.setUser(updatedUser);
      }

      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      };
    }
  }

  /**
   * Generate a proper UUID for user using crypto API
   */
  private static generateUserId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Generate consistent UUID from email using crypto API
   */
  private static generateUserIdFromEmail(email: string): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      // For consistency, we'll still use a deterministic approach
      // but with proper UUID format
      const hash = this.hashString(email);
      const uuid = crypto.randomUUID();
      // Use the hash to modify the UUID slightly for consistency
      const hashHex = hash.toString(16).padStart(8, '0');
      return uuid.replace(/^.{8}/, hashHex.substring(0, 8));
    }
    
    // Fallback: create a deterministic UUID-like string
    const hash = this.hashString(email);
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    const random1 = Math.random().toString(16).substring(2, 6);
    const random2 = Math.random().toString(16).substring(2, 6);
    const random3 = Math.random().toString(16).substring(2, 6);
    const random4 = Math.random().toString(16).substring(2, 6);
    
    return `${hex.substring(0, 8)}-${random1}-4${random2.substring(0, 3)}-${(Math.abs(hash) % 4 + 8).toString(16)}${random3}-${random4}${hex.substring(0, 4)}`;
  }

  /**
   * Hash a string to a number
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Hash a password for storage
   */
  private static hashPassword(password: string): string {
    // Simple hash function - in production, use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Create a demo user for testing purposes
   */
  static createDemoUser(role: UserRole): LocalUser {
    const demoUser: LocalUser = {
      id: `demo-${role}-${Date.now()}`,
      username: role === 'student' ? 'Demo Student' : 'Demo Teacher',
      email: role === 'student' ? 'demo.student@ecolearn.com' : 'demo.teacher@ecolearn.com',
      role: role,
      created_at: new Date().toISOString()
    };

    // Store demo user in localStorage
    this.setUser(demoUser);
    
    // Create demo data for teachers
    if (role === 'teacher') {
      // Import TeacherDataManager dynamically to avoid circular imports
      import('./teacherData').then(({ TeacherDataManager }) => {
        TeacherDataManager.createDemoData(demoUser.id);
      });
    }
    
    return demoUser;
  }

  /**
   * Store user in localStorage
   */
  private static setUser(user: LocalUser): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
}
