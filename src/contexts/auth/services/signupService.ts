
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { baseAuthService } from './baseAuthService';

export const signupService = {
  async signup(email: string, password: string, name?: string): Promise<void> {
    try {
      console.log(`Auth service: Attempting signup for ${email}`);
      
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error(`Signup error: ${error.message}`);
        
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        
        throw error;
      }
      
      // Create user profile - but handle the case where table doesn't exist
      if (data.user) {
        console.log(`Creating profile for user ${data.user.id}`);
        
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email,
              name: name || email.split('@')[0],
              created_at: new Date().toISOString(),
            });
            
          if (profileError) {
            console.error(`Profile creation error: ${profileError.message || 'Table may not exist'}`);
            
            // Don't throw an error if it's just a missing table - user can still use the app
            console.warn('Profile table does not exist - user created but no profile stored');
          }
        } catch (profileErr: any) {
          console.error('Profile creation failed:', profileErr);
          // Don't throw - allow signup to continue without profile
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email to confirm your account.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Signup service error:', error);
      
      // Provide more specific error message
      const errorMessage = error?.message || "Could not create your account. Please try again.";
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }
};
