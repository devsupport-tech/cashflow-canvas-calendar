import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Budget } from '@/lib/types';

export function useBudgetData() {
  const queryClient = useQueryClient();

  // Fetch all budgets
  const { data: budgets = [], isLoading, error } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Budget[];
    },
  });

  // Add budget
  const addBudget = useMutation({
    mutationFn: async (budget: Omit<Budget, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('budgets')
        .insert([budget])
        .select()
        .single();
      if (error) throw error;
      return data as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  // Update budget
  const updateBudget = useMutation({
    mutationFn: async (budget: Budget) => {
      const { id, ...fields } = budget;
      const { data, error } = await supabase
        .from('budgets')
        .update(fields)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  // Delete budget
  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return {
    budgets,
    isLoading,
    error,
    addBudget: addBudget.mutateAsync,
    updateBudget: updateBudget.mutateAsync,
    deleteBudget: deleteBudget.mutateAsync,
  };
}
