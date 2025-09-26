import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase client

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Helper function to normalize user metadata across different auth providers
const normalizeUserMetadata = (user) => {
  if (!user) return null;
  
  // Make a copy to avoid modifying the original object
  const normalizedUser = { ...user };
  
  if (normalizedUser.user_metadata) {
    // For Google Auth: Split name into first_name and last_name if they don't exist
    if (normalizedUser.user_metadata.name && !normalizedUser.user_metadata.first_name) {
      const nameParts = normalizedUser.user_metadata.name.split(' ');
      normalizedUser.user_metadata.first_name = nameParts[0] || '';
      normalizedUser.user_metadata.last_name = nameParts.slice(1).join(' ') || '';
    }
  }
  
  return normalizedUser;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authFunctionsReady, setAuthFunctionsReady] = useState(false);

  // Login function using Supabase
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Explicitly store the token for immediate use
    if (data.session?.access_token) {
      localStorage.setItem('rectifyToken', data.session.access_token);
      console.log('Token stored after login');
    }
    
    return data.user;
  }

  // Google sign-in function
  async function loginWithGoogle() {
    console.log('Initiating Google login');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/upload`,
      }
    });
    
    if (error) {
      console.error('Google login error:', error);
      throw error;
    }
    
    console.log('Google login initiated, redirecting...');
    return data;
  }

  // Signup function using Supabase
  async function signup(email, password, options = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options.data // Optional: Store additional user metadata
      }
    });
    if (error) throw error;
    
    // If the signup immediately returns a session (depends on email confirmation settings)
    if (data.session?.access_token) {
      localStorage.setItem('rectifyToken', data.session.access_token);
      console.log('Token stored after signup');
    }
    
    return data.user;
  }

  // Logout function using Supabase
  async function logout() {
    console.log('Logging out user');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local tokens
      localStorage.removeItem('rectifyToken');
      localStorage.removeItem('refreshToken');
      console.log('User logged out successfully');
      
      // Supabase onAuthStateChange will handle setting user to null
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Reset password function using Supabase
  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      console.error('Password reset error:', error);
      if (error.message.includes('User not found')) {
        throw new Error('No account found with this email address.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many password reset attempts. Please try again later.');
      }
      throw error;
    }
    return true;
  }

  // Update password after reset - modified to handle both token formats
  async function updatePassword(newPassword, recoveryToken = null) {
    try {
      // If we have a recovery token from the query parameter (new format)
      if (recoveryToken) {
        console.log("Using recovery token from query parameters");
        
        // Use the verificationType as 'recovery' with the token
        const { error } = await supabase.auth.verifyOtp({
          token: recoveryToken,
          type: 'recovery',
          options: {
            password: newPassword
          }
        });
        
        if (error) {
          console.error('Password update error:', error);
          throw error;
        }
      } else {
        // Try to use the token from localStorage (old format)
        const token = localStorage.getItem('rectifyToken');
        
        if (token) {
          console.log("Using token from localStorage for password update");
          
          // Set the token in Supabase for this operation
          const { error: sessionError } = await supabase.auth.setSession(token);
          if (sessionError) {
            console.error("Error setting session:", sessionError);
            throw new Error('Invalid or expired reset token. Please request a new password reset link.');
          }
          
          // Update the password
          const { error } = await supabase.auth.updateUser({
            password: newPassword
          });
          
          if (error) {
            console.error('Password update error:', error);
            if (error.message.includes('Invalid login credentials')) {
              throw new Error('Invalid or expired reset token. Please request a new password reset link.');
            }
            throw error;
          }
        } else {
          throw new Error('No valid token found. Please request a new password reset link.');
        }
      }

      // Sign out the user after password reset for security
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error("Password update failed:", error);
      throw error;
    }
  }

  // Initialize auth functions first to ensure they're always available
  useEffect(() => {
    // Make sure auth functions are available before rendering children
    setAuthFunctionsReady(true);
  }, []);

  // Listen to Supabase auth state changes
  useEffect(() => {
    if (!authFunctionsReady) return;
    
    setLoading(true);
    
    // First check if there's an existing session
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Normalize user metadata between auth providers
          const normalizedUser = normalizeUserMetadata(session.user);
          setCurrentUser(normalizedUser);
          
          // Store the token for API requests
          localStorage.setItem('rectifyToken', session.access_token);
          console.log('Auth initialized with existing session');
        } else {
          console.log('No existing session found');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    getInitialSession();
    
    // Then listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event);
      
      // Normalize user metadata when auth state changes
      const normalizedUser = session?.user ? normalizeUserMetadata(session.user) : null;
      setCurrentUser(normalizedUser);
      
      // Update the token in localStorage whenever auth state changes
      if (session?.access_token) {
        localStorage.setItem('rectifyToken', session.access_token);
        console.log('Token updated in localStorage');
      } else {
        localStorage.removeItem('rectifyToken');
        console.log('Token removed from localStorage');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription');
      subscription?.unsubscribe();
    };
  }, [authFunctionsReady]);

  // Always provide all auth functions, even if not logged in
  const value = {
    currentUser,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    updatePassword,
    loading
  };

  // Only render children when auth functions are ready to use
  return (
    <AuthContext.Provider value={value}>
      {authFunctionsReady && !loading && children}
    </AuthContext.Provider>
  );
}