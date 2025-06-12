import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

export interface TransactionItem {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  category?: string;
  expenseType?: string;
  tags?: string[];
}

export const useTransactionData = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  // Fetch transactions from Supabase
  const fetchTransactions = async (): Promise<TransactionItem[]> => {
    if (!user) return [];
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (currentWorkspace !== 'all') {
        query = query.eq('category', currentWorkspace);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((tx: any) => ({
        id: tx.id,
        amount: tx.amount,
        description: tx.description,
        date: tx.date,
        type: tx.type,
        category: tx.category,
        expenseType: tx.expense_type,
        tags: tx.tags || [],
      }));
    } catch (error) {
      toast({
        title: 'Failed to load transactions',
        description: 'There was an error loading your transactions. Please refresh the page.',
        variant: 'destructive',
      });
      return [];
    }
  };

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', user?.id, currentWorkspace],
    queryFn: fetchTransactions,
    enabled: !!user,
  });
    enabled: !!user,
  });

  // Add transaction
  const addTransactionMutation = useMutation({
    mutationFn: async (tx: Omit<TransactionItem, 'id'>) => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...tx,
          user_id: user.id,
          expense_type: tx.expenseType,
          created_at: new Date().toISOString(),
        })
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions', user?.id, currentWorkspace]);
      toast({ title: 'Transaction added', description: 'Your transaction was added successfully.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add transaction',
        description: error.message || 'Could not add transaction.',
        variant: 'destructive',
      });
    },
  });

  // Update transaction
  const updateTransactionMutation = useMutation({
    mutationFn: async (tx: TransactionItem) => {
      if (!user) throw new Error('User not authenticated');
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: tx.amount,
          description: tx.description,
          date: tx.date,
          type: tx.type,
          category: tx.category,
          expense_type: tx.expenseType,
          tags: tx.tags,
        })
        .eq('id', tx.id)
        .eq('user_id', user.id);
      if (error) throw error;
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions', user?.id, currentWorkspace]);
      toast({ title: 'Transaction updated', description: 'Your transaction was updated.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update transaction',
        description: error.message || 'Could not update transaction.',
        variant: 'destructive',
      });
    },
  });

  // Delete transaction
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions', user?.id, currentWorkspace]);
      toast({ title: 'Transaction deleted', description: 'Your transaction was deleted.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete transaction',
        description: error.message || 'Could not delete transaction.',
        variant: 'destructive',
      });
    },
  });

  return {
    transactions,
    isLoading,
    error,
    addTransaction: addTransactionMutation.mutateAsync,
    updateTransaction: updateTransactionMutation.mutateAsync,
    deleteTransaction: deleteTransactionMutation.mutateAsync,
  };
};
