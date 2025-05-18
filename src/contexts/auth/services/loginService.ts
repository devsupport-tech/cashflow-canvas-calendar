
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { baseAuthService } from './baseAuthService';

export const loginService = {
  async login(email: string, password: string): Promise<void> {
    try {
      console.log(`Auth service: Attempting login for ${email}`);
      
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Map Supabase error messages to more user-friendly messages
        let errorMessage = error.message;
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Incorrect email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email before logging in.";
        }
        
        console.error(`Login error: ${errorMessage}`);
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw new Error(errorMessage);
      }
      
      console.log("Login successful", data?.user?.id);
      
      // Only show toast if we have a valid user
      if (data?.user) {
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
      }
      
      return Promise.resolve();
    } catch (error: any) {
      return baseAuthService.handleError(
        error, 
        "Invalid credentials. Please try again.", 
        "Login failed"
      );
    }
  },

  async logout(): Promise<void> {
    try {
      console.log("Auth service: Attempting logout");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error(`Logout error: ${error.message}`);
        
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      return baseAuthService.handleError(
        error, 
        "Could not log you out. Please try again.", 
        "Logout failed"
      );
    }
  }
};
