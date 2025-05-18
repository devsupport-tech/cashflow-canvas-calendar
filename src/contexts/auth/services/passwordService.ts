
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { baseAuthService } from './baseAuthService';

export const passwordService = {
  async resetPassword(email: string): Promise<void> {
    try {
      console.log(`Auth service: Attempting password reset for ${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error(`Password reset error: ${error.message}`);
        
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      return baseAuthService.handleError(
        error, 
        "Could not send reset email. Please try again.", 
        "Password reset failed"
      );
    }
  }
};
