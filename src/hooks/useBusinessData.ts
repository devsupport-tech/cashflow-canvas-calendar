import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Business } from '@/lib/types';
import { useAuth } from '@/contexts/auth';

export function useBusinessData() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all businesses for the current user
  const { data: businesses = [], isLoading, error } = useQuery<Business[]>({
    queryKey: ['businesses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Business[];
    },
    enabled: !!user,
  });

  // Add business
  const addBusiness = useMutation({
    mutationFn: async (business: Omit<Business, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('businesses')
        .insert([{ ...business, user_id: user.id, created_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw error;
      return data as Business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses', user?.id] });
    },
  });

  // Update business
  const updateBusiness = useMutation({
    mutationFn: async (business: Business) => {
      const { id, ...fields } = business;
      const { data, error } = await supabase
        .from('businesses')
        .update(fields)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();
      if (error) throw error;
      return data as Business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses', user?.id] });
    },
  });

  // Delete business
  const deleteBusiness = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) throw error;
      return id;
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
