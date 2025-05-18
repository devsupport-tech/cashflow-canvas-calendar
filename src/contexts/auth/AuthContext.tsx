
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
        
        // Get session and user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
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
            
            // Redirect to dashboard if on login page
            if (location.pathname === '/login') {
              navigate('/', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener with error handling
    let subscription: { unsubscribe: () => void } | undefined;
    
    try {
      const authListener = supabase.auth.onAuthStateChange?.(
        async (event, session) => {
          console.log('Auth state changed:', event);
          if (event === 'SIGNED_IN' && session) {
            const { user: authUser } = session;
            
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
            
            // Redirect to dashboard on sign in
            navigate('/', { replace: true });
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
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
    }

    checkAuth();

    // Cleanup the subscription
    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      }
    };
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.login(email, password);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      await authService.signup(email, password, name);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
      return Promise.resolve();
    } catch (error) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
