
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { authService } from './authService';
import { User, AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Checking auth status...");
        
        // Get session and user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Session found, getting user data");
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            console.log("Auth user found:", authUser.id);
            // Get user profile data
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
              
            const userData = {
              id: authUser.id,
              email: authUser.email || '',
              name: profile?.name || authUser.email?.split('@')[0] || '',
              avatarUrl: profile?.avatar_url || undefined,
            };
            
            console.log("Setting user data:", userData);
            setUser(userData);
          }
        } else {
          console.log("No session found");
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        console.log("Auth check complete, setting isLoading to false");
        setIsLoading(false);
      }
    };

    // Set up auth state change listener with error handling
    let subscription: { unsubscribe: () => void } | undefined;
    
    try {
      console.log("Setting up auth state change listener");
      const authListener = supabase.auth.onAuthStateChange?.(
        async (event, session) => {
          console.log('Auth state changed:', event, session ? 'with session' : 'no session');
          
          if (event === 'SIGNED_IN' && session) {
            const { user: authUser } = session;
            
            console.log("User signed in:", authUser.id);
            
            // Get user profile data
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
              
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              name: profile?.name || authUser.email?.split('@')[0] || '',
              avatarUrl: profile?.avatar_url || undefined,
            });
            
            setIsLoading(false);
            
            // Get the intended destination from state, or default to home
            const from = (location.state as any)?.from || '/';
            console.log('Auth listener - Redirecting to:', from);
            navigate(from, { replace: true });
          } else if (event === 'SIGNED_OUT') {
            console.log("User signed out");
            setUser(null);
            setIsLoading(false);
            navigate('/login', { replace: true });
          }
        }
      );
      
      // Check if we got a valid subscription back
      if (authListener && 'data' in authListener) {
        subscription = authListener.data.subscription;
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setIsLoading(false);
    }

    checkAuth();

    // Cleanup the subscription
    return () => {
      if (subscription) {
        try {
          console.log("Cleaning up auth subscription");
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      }
    };
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    console.log("Login attempt for:", email);
    setIsLoading(true);
    try {
      await authService.login(email, password);
      // The redirection will be handled by the auth state change listener
      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return Promise.reject(error);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    console.log("Signup attempt for:", email);
    setIsLoading(true);
    try {
      await authService.signup(email, password, name);
      setIsLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    console.log("Logout attempt");
    try {
      await authService.logout();
      // The redirection will be handled by the auth state change listener
      return Promise.resolve();
    } catch (error) {
      console.error("Logout error:", error);
      return Promise.reject(error);
    }
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user?.id) throw new Error("Not authenticated");
      await authService.updateProfile(user.id, data);
      // Update local state
      setUser(current => current ? { ...current, ...data } : null);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
  };

  console.log("Auth context state:", { 
    isAuthenticated: !!user, 
    isLoading, 
    user: user ? `${user.email} (${user.id})` : 'none' 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
