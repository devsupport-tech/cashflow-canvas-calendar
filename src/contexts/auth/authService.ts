
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { User } from './types';

export const authService = {
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
      console.error('Login error:', error);
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  },

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
      console.error('Signup error:', error);
      
      toast({
        title: "Signup failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
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
      console.error('Logout error:', error);
      
      toast({
        title: "Logout failed",
        description: error.message || "Could not log you out. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  },

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
      console.error('Password reset error:', error);
      
      toast({
        title: "Password reset failed",
        description: error.message || "Could not send reset email. Please try again.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      console.log(`Auth service: Updating profile for user ${userId}`, data);
      
      if (!userId) throw new Error("Not authenticated");
      
      // Update user profile in database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: data.name,
          avatar_url: data.avatarUrl,
        })
        .eq('id', userId);
        
      if (error) {
        console.error(`Profile update error: ${error.message}`);
        
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive",
        });
        
        throw error;
      }
      
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
  }
};
