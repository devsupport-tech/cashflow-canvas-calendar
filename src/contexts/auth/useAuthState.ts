import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from './types';
import { toast } from '@/components/ui/use-toast';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🔐 Setting up auth state listener");
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.warn("⚠️ Supabase not configured, using demo mode");
      // In demo mode, simulate a logged-in user after a short delay
      setTimeout(() => {
        setUser({
          id: 'demo-user-123',
          email: 'demo@example.com',
          name: 'Demo User',
          created_at: new Date().toISOString()
        });
        setIsLoading(false);
        toast({
          title: "Demo Mode Active",
          description: "You're using the demo version. Data won't be saved.",
          variant: "default",
          duration: 5000,
        });
      }, 1000);
      return;
    }
    
    // Get initial session with proper error handling
    const getInitialSession = async () => {
      try {
        setSessionError(null);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setSessionError(error.message);
          toast({
            title: "Session Error",
            description: "Failed to retrieve your session. Please try logging in again.",
            variant: "destructive",
            duration: 5000,
          });
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Initial session found:', session.user.id);
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            created_at: session.user.created_at || new Date().toISOString()
          };
          setUser(userData);
          
          // Store user data in localStorage for persistence
          localStorage.setItem('cashflow_user', JSON.stringify(userData));
        } else {
          console.log('ℹ️ No initial session found');
          // Check localStorage for cached user data
          const cachedUser = localStorage.getItem('cashflow_user');
          if (cachedUser) {
            try {
              const parsedUser = JSON.parse(cachedUser);
              console.log('📱 Using cached user data:', parsedUser.id);
              setUser(parsedUser);
            } catch (e) {
              console.warn('⚠️ Invalid cached user data, clearing');
              localStorage.removeItem('cashflow_user');
            }
          }
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('💥 Error in getInitialSession:', error);
        setSessionError(error.message || 'Unknown session error');
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please refresh the page.",
          variant: "destructive",
          duration: 8000,
        });
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        setSessionError(null);
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              created_at: session.user.created_at || new Date().toISOString()
            };
            setUser(userData);
            localStorage.setItem('cashflow_user', JSON.stringify(userData));
            setIsLoading(false);
            
            toast({
              title: "Welcome back!",
              description: `Logged in as ${userData.email}`,
              variant: "default",
              duration: 3000,
            });
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setUser(null);
            localStorage.removeItem('cashflow_user');
            setIsLoading(false);
            
            toast({
              title: "Signed out",
              description: "You have been successfully signed out.",
              variant: "default",
              duration: 3000,
            });
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('🔄 Token refreshed for user:', session.user.id);
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              created_at: session.user.created_at || new Date().toISOString()
            };
            setUser(userData);
            localStorage.setItem('cashflow_user', JSON.stringify(userData));
          } else if (event === 'USER_UPDATED' && session?.user) {
            console.log('👤 User updated:', session.user.id);
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              created_at: session.user.created_at || new Date().toISOString()
            };
            setUser(userData);
            localStorage.setItem('cashflow_user', JSON.stringify(userData));
          }
        } catch (error: any) {
          console.error('💥 Error handling auth state change:', error);
          setSessionError(error.message || 'Auth state change error');
          toast({
            title: "Authentication Error",
            description: "There was a problem updating your authentication status.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    );

    return () => {
      console.log("🧹 Cleaning up auth state listener");
      subscription?.unsubscribe?.();
    };
  }, []);

  return { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading
  };
}
