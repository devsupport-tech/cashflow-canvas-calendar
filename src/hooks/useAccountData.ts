import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Account } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useAccountData() {
  const queryClient = useQueryClient();

  // Fetch all accounts
  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Account[];
    },
  });

  // Add account
  const addAccount = useMutation({
    mutationFn: async (account: Omit<Account, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('accounts')
        .insert([account])
        .select()
        .single();
      if (error) throw error;
      return data as Account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  // Update account
  const updateAccount = useMutation({
    mutationFn: async (account: Account) => {
      const { id, ...fields } = account;
      const { data, error } = await supabase
        .from('accounts')
        .update(fields)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  // Optimistic UI with undo for account deletion
  let undoDeleteTimeout: ReturnType<typeof setTimeout> | null = null;
  let lastDeletedAccount: Account | null = null;

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      // Find the account to delete for undo
      const accountToDelete = accounts.find((a: Account) => a.id === id);
      lastDeletedAccount = accountToDelete || null;
      // Optimistically remove from cache
      queryClient.setQueryData(['accounts'], (old: Account[] = []) => old.filter(a => a.id !== id));
      return id;
    },
    onSuccess: (id: string) => {
      toast({
        title: 'Account deleted',
        description: 'Account has been deleted. ',
        action: {
          label: 'Undo',
          onClick: async () => {
            if (lastDeletedAccount) {
              await addAccount.mutateAsync({
                name: lastDeletedAccount.name,
                type: lastDeletedAccount.type,
                balance: lastDeletedAccount.balance,
                category: lastDeletedAccount.category
              });
              toast({
                title: 'Undo Successful',
                description: 'Account restored.'
              });
              lastDeletedAccount = null;
              if (undoDeleteTimeout) clearTimeout(undoDeleteTimeout);
            }
          }
        },
        duration: 5000
      });
      // Actually delete from backend after timeout if not undone
      undoDeleteTimeout = setTimeout(async () => {
        if (lastDeletedAccount) {
          const { error } = await supabase.from('accounts').delete().eq('id', id);
          if (error) {
            toast({
              title: 'Delete Failed',
              description: error.message,
              variant: 'destructive'
            });
          }
          lastDeletedAccount = null;
        }
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
      }, 5000);
    },
    onError: (err: any) => {
      toast({
        title: 'Delete Failed',
        description: err.message || 'Failed to delete account.',
        variant: 'destructive'
      });
    }
  });

  // Toast notifications for add/update
  const wrappedAddAccount = async (...args: Parameters<typeof addAccount.mutateAsync>) => {
    try {
      const result = await addAccount.mutateAsync(...args);
      toast({ title: 'Account Created', description: 'Account added successfully.' });
      return result;
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw err;
    }
  };
  const wrappedUpdateAccount = async (...args: Parameters<typeof updateAccount.mutateAsync>) => {
    try {
      const result = await updateAccount.mutateAsync(...args);
      toast({ title: 'Account Updated', description: 'Account updated successfully.' });
      return result;
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw err;
    }
  };


  return {
    accounts,
    isLoading,
    error,
    addAccount: wrappedAddAccount,
    updateAccount: wrappedUpdateAccount,
    deleteAccount: deleteAccount.mutateAsync,
  };

}
