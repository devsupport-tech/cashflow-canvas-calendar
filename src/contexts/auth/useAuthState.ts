
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { User } from './types';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  const checkAuth = useCallback(async () => {
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
          
          // Try to get user profile data, but don't fail if table doesn't exist
          let profile = null;
          try {
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
            profile = profileData;
          } catch (profileError) {
            console.warn('Profile table does not exist or profile not found, using auth data only');
          }
            
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
  }, []);

  // Effect for initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up auth state change listener
  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'with session' : 'no session');
      
      if (event === 'SIGNED_IN' && session) {
        try {
          setIsLoading(true);
          const { user: authUser } = session;
          
          console.log("User signed in:", authUser.id);
          
          // Try to get user profile data, but don't fail if table doesn't exist
          let profile = null;
          try {
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
            profile = profileData;
          } catch (profileError) {
            console.warn('Profile table does not exist or profile not found, using auth data only');
          }
            
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: profile?.name || authUser.email?.split('@')[0] || '',
            avatarUrl: profile?.avatar_url || undefined,
          });
          
          // Show success toast
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          
          // Get the intended destination from state, or default to home
          const from = (location.state as any)?.from || '/';
          console.log('Auth listener - Redirecting to:', from);
          navigate(from, { replace: true });
        } catch (error) {
          console.error('Error setting user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
        setIsLoading(false);
        navigate('/login', { replace: true });
      }
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, [navigate, location]);

  return { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading
  };
}
