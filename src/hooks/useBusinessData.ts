import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Business } from '@/lib/types';
import { useAuth } from '@/contexts/auth';
import { errorHandler } from '@/lib/errorHandler';
import { toast } from '@/components/ui/use-toast';

// Mock businesses data for demo mode
const mockBusinesses: Business[] = [
  {
    id: 'demo-business-1',
    name: 'Freelance Design Studio',
    color: '#3B82F6',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-business-2',
    name: 'Consulting Services',
    color: '#10B981',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-business-3',
    name: 'E-commerce Store',
    color: '#8B5CF6',
    createdAt: new Date().toISOString()
  }
];

export function useBusinessData() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all businesses with demo mode support
  const { data: businesses = [], isLoading, error } = useQuery<Business[]>({
    queryKey: ['businesses', user?.id],
    queryFn: async () => {
      try {
        // Return mock data in demo mode
        if (!isSupabaseConfigured) {
          console.log('📊 Using demo businesses data');
          return mockBusinesses;
        }

        if (!user) {
          console.log('⚠️ No user found, returning empty businesses');
          return [];
        }

        // Fetch from Supabase in production mode
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('❌ Error fetching businesses:', error);
          errorHandler.handleError(error, 'Fetch Businesses', false);
          // Return mock data as fallback
          return mockBusinesses;
        }
        
        console.log('✅ Successfully fetched businesses:', data?.length || 0);
        // Convert snake_case to camelCase for frontend
        const businesses = data?.map((item: any) => ({
          id: item.id,
          name: item.name,
          color: item.color,
          createdAt: item.created_at
        })) || [];
        
        return businesses as Business[];
      } catch (error) {
        console.error('💥 Unexpected error in businesses query:', error);
        errorHandler.handleError(error, 'Businesses Query', false);
        // Return mock data as fallback
        return mockBusinesses;
      }
    },
    enabled: true, // Always enabled since we have demo mode fallback
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry in demo mode
      if (!isSupabaseConfigured) return false;
      // Retry up to 2 times for network errors
      return failureCount < 2;
    }
  });

  // Add business with demo mode support
  const addBusiness = useMutation({
    mutationFn: async (business: Omit<Business, 'id' | 'createdAt'>) => {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode: create mock business
          const newBusiness: Business = {
            ...business,
            id: `demo-business-${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          console.log('📊 Demo mode: Adding business', newBusiness.name);
          
          toast({
            title: "Success (Demo)",
            description: `Business "${newBusiness.name}" added successfully in demo mode`,
            duration: 3000,
          });
          
          return newBusiness;
        }

        if (!user) {
          throw new Error('User not authenticated');
        }

        // Production mode: save to Supabase
        // Convert camelCase to snake_case for Supabase
        const businessData = {
          name: business.name,
          color: business.color,
          user_id: user.id,
          created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('businesses')
          .insert([businessData])
          .select()
          .single();
          
        if (error) {
          console.error('❌ Error adding business:', error);
          throw error;
        }
        
        console.log('✅ Successfully added business:', data.name);
        
        toast({
          title: "Success",
          description: `Business "${data.name}" added successfully`,
          duration: 3000,
        });
        
        // Convert snake_case to camelCase for frontend
        const newBusiness: Business = {
          id: data.id,
          name: data.name,
          color: data.color,
          createdAt: data.created_at
        };
        
        return newBusiness;
      } catch (error) {
        console.error('💥 Error in addBusiness mutation:', error);
        errorHandler.handleError(error, 'Add Business');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses', user?.id] });
    },
    onError: (error) => {
      console.error('❌ Add business failed:', error);
      // Error handling is already done in mutationFn, but we can add additional logic here if needed
    }
  });

  // Update business with demo mode support
  const updateBusiness = useMutation({
    mutationFn: async (business: Business) => {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode: return updated business
          console.log('📊 Demo mode: Updating business', business.name);
          
          toast({
            title: "Success (Demo)",
            description: `Business "${business.name}" updated successfully in demo mode`,
            duration: 3000,
          });
          
          return business;
        }

        // Production mode: update in Supabase
        const { id, createdAt, ...fields } = business;
        const updateData = {
          name: fields.name,
          color: fields.color
        };
        
        const { data, error } = await supabase
          .from('businesses')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user?.id)
          .select()
          .single();
          
        if (error) {
          console.error('❌ Error updating business:', error);
          throw error;
        }
        
        console.log('✅ Successfully updated business:', data.name);
        
        toast({
          title: "Success",
          description: `Business "${data.name}" updated successfully`,
          duration: 3000,
        });
        
        // Convert snake_case to camelCase for frontend
        const updatedBusiness: Business = {
          id: data.id,
          name: data.name,
          color: data.color,
          createdAt: data.created_at
        };
        
        return updatedBusiness;
      } catch (error) {
        console.error('💥 Error in updateBusiness mutation:', error);
        errorHandler.handleError(error, 'Update Business');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses', user?.id] });
    },
  });

  // Delete business with demo mode support
  const deleteBusiness = useMutation({
    mutationFn: async (id: string) => {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode: just return the id
          const businessToDelete = businesses.find((b: Business) => b.id === id);
          console.log('📊 Demo mode: Deleting business', businessToDelete?.name);
          
          toast({
            title: "Success (Demo)",
            description: `Business deleted successfully in demo mode`,
            duration: 3000,
          });
          
          return id;
        }

        // Production mode: delete from Supabase
        const { error } = await supabase
          .from('businesses')
          .delete()
          .eq('id', id)
          .eq('user_id', user?.id);
          
        if (error) {
          console.error('❌ Error deleting business:', error);
          throw error;
        }
        
        console.log('✅ Successfully deleted business');
        
        toast({
          title: "Success",
          description: "Business deleted successfully",
          duration: 3000,
        });
        
        return id;
      } catch (error) {
        console.error('💥 Error in deleteBusiness mutation:', error);
        errorHandler.handleError(error, 'Delete Business');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses', user?.id] });
    },
  });

  return {
    businesses,
    isLoading,
    error,
    addBusiness: addBusiness.mutateAsync,
    updateBusiness: updateBusiness.mutateAsync,
    deleteBusiness: deleteBusiness.mutateAsync,
  };
}
