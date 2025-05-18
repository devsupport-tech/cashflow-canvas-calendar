
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
      
      // Create user profile
      if (data.user) {
        console.log(`Creating profile for user ${data.user.id}`);
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email,
            name: name || email.split('@')[0],
            created_at: new Date().toISOString(),
          });
          
        if (profileError) {
          console.error(`Profile creation error: ${profileError.message}`);
          
          toast({
            title: "Profile setup failed",
            description: "Your account was created but we couldn't set up your profile.",
            variant: "destructive",
          });
          
          throw profileError;
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email to confirm your account.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      return baseAuthService.handleError(
        error, 
        "Could not create your account. Please try again.", 
        "Signup failed"
      );
    }
  }
};
