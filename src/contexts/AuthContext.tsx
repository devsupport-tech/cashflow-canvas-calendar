
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
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
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            navigate('/login');
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
  }, [navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
      });
      
      navigate('/');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email,
            name: name || email.split('@')[0],
            created_at: new Date().toISOString(),
          });
          
        if (profileError) throw profileError;
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email to confirm your account.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      navigate('/login');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message || "Could not log you out. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: error.message || "Could not send reset email. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user?.id) throw new Error("Not authenticated");
      
      // Update user profile in database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: data.name,
          avatar_url: data.avatarUrl,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser(current => current ? { ...current, ...data } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Profile update failed",
        description: error.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
      
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

export const useAuth = () => useContext(AuthContext);
