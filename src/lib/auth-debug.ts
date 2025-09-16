import { supabase } from './supabase';

/**
 * Debug function to check Supabase configuration and connection
 */
export const debugSupabaseConfig = async () => {
  console.log("=== Supabase Debug Information ===");
  
  try {
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("Current session:", session);
    console.log("Session error:", sessionError);
    
    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("Current user:", user);
    console.log("User error:", userError);
    
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    console.log("Database connection test:", { testData, testError });
    
    // Check auth settings
    console.log("Supabase URL:", supabase.supabaseUrl);
    console.log("Supabase Key (first 20 chars):", supabase.supabaseKey.substring(0, 20) + "...");
    
  } catch (error) {
    console.error("Debug error:", error);
  }
  
  console.log("=== End Debug Information ===");
};

/**
 * Test registration with minimal configuration
 */
export const testRegistration = async (email: string, password: string, name: string) => {
  console.log("=== Testing Registration ===");
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        // Remove emailRedirectTo to see if that's causing issues
      },
    });
    
    console.log("Registration result:", { data, error });
    
    if (error) {
      console.error("Registration error:", error.message);
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      console.log("User created:", {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        created_at: data.user.created_at
      });
      
      return { 
        success: true, 
        user: data.user,
        needsConfirmation: !data.user.email_confirmed_at
      };
    }
    
    return { success: false, error: "No user data returned" };
    
  } catch (error) {
    console.error("Registration test error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Test login with existing credentials
 */
export const testLogin = async (email: string, password: string) => {
  console.log("=== Testing Login ===");
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log("Login result:", { data, error });
    
    if (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      console.log("Login successful:", {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at
      });
      
      return { success: true, user: data.user };
    }
    
    return { success: false, error: "No user data returned" };
    
  } catch (error) {
    console.error("Login test error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

