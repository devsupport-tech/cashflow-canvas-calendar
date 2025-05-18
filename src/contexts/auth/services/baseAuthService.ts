
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

// Base service with shared error handling and logging functionality
export const baseAuthService = {
  handleError(error: any, defaultMessage: string, title: string): never {
    console.error(`${title} error:`, error);
    
    const errorMessage = error.message || defaultMessage;
    
    toast({
      title,
      description: errorMessage,
      variant: "destructive",
    });
    
    throw error;
  }
};
