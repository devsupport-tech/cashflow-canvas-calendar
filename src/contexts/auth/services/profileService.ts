
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { User } from '../types';
import { baseAuthService } from './baseAuthService';

export const profileService = {
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
      return baseAuthService.handleError(
        error, 
        "Could not update your profile. Please try again.", 
        "Profile update failed"
      );
    }
  }
};
