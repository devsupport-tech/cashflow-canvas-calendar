
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Account } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { errorHandler } from '@/lib/errorHandler';

// Mock accounts data for demo mode
const mockAccounts: Account[] = [
  {
    id: 'demo-account-1',
    name: 'Main Checking',
    type: 'checking',
    balance: 2500.00,
    category: 'personal',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-account-2', 
    name: 'Savings Account',
    type: 'savings',
    balance: 15000.00,
    category: 'personal',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-account-3',
    name: 'Business Checking',
    type: 'checking', 
    balance: 8500.00,
    category: 'business',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-account-4',
    name: 'Credit Card',
    type: 'credit',
    balance: -1200.00,
    category: 'personal',
    created_at: new Date().toISOString()
  }
];

export function useAccountData() {
  const queryClient = useQueryClient();

  // Fetch all accounts with demo mode support
  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      try {
        // Return mock data in demo mode
        if (!isSupabaseConfigured) {
          console.log('📊 Using demo accounts data');
          return mockAccounts;
        }

        // Fetch from Supabase in production mode
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('❌ Error fetching accounts:', error);
          errorHandler.handleError(error, 'Fetch Accounts', false);
          // Return mock data as fallback
          return mockAccounts;
        }
        
        console.log('✅ Successfully fetched accounts:', data?.length || 0);
        return data as Account[];
      } catch (error) {
        console.error('💥 Unexpected error in accounts query:', error);
        errorHandler.handleError(error, 'Accounts Query', false);
        // Return mock data as fallback
        return mockAccounts;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry in demo mode
      if (!isSupabaseConfigured) return false;
      // Retry up to 2 times for network errors
      return failureCount < 2;
    }
  });

  // Add account with demo mode support
  const addAccount = useMutation({
    mutationFn: async (account: Omit<Account, 'id' | 'created_at'>) => {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode: create mock account
          const newAccount: Account = {
            ...account,
            id: `demo-account-${Date.now()}`,
            created_at: new Date().toISOString()
          };
          console.log('📊 Demo mode: Adding account', newAccount.name);
          return newAccount;
        }

        // Production mode: save to Supabase
        const { data, error } = await supabase
          .from('accounts')
          .insert([account])
          .select()
          .single();
          
        if (error) {
          console.error('❌ Error adding account:', error);
          throw error;
        }
        
        console.log('✅ Successfully added account:', data.name);
        return data as Account;
      } catch (error) {
        console.error('💥 Error in addAccount mutation:', error);
        errorHandler.handleError(error, 'Add Account');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  // Update account with demo mode support
  const updateAccount = useMutation({
    mutationFn: async (account: Account) => {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode: return updated account
          console.log('📊 Demo mode: Updating account', account.name);
          return account;
        }

        // Production mode: update in Supabase
        const { id, ...fields } = account;
        const { data, error } = await supabase
          .from('accounts')
          .update(fields)
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          console.error('❌ Error updating account:', error);
          throw error;
        }
        
        console.log('✅ Successfully updated account:', data.name);
        return data as Account;
      } catch (error) {
        console.error('💥 Error in updateAccount mutation:', error);
        errorHandler.handleError(error, 'Update Account');
        throw error;
      }
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
      try {
        // Find the account to delete for undo
        const accountToDelete = accounts.find((a: Account) => a.id === id);
        lastDeletedAccount = accountToDelete || null;
        
        // Optimistically remove from cache
        queryClient.setQueryData(['accounts'], (old: Account[] = []) => old.filter(a => a.id !== id));
        
        if (!isSupabaseConfigured) {
          console.log('📊 Demo mode: Deleting account', accountToDelete?.name);
          return id;
        }
        
        console.log('✅ Optimistically deleted account:', accountToDelete?.name);
        return id;
      } catch (error) {
        console.error('💥 Error in deleteAccount mutation:', error);
        errorHandler.handleError(error, 'Delete Account');
        throw error;
      }
    },
    onSuccess: (id: string) => {
      toast({
        title: 'Account deleted',
        description: 'Account has been deleted.',
        duration: 5000
      });
      
      // Actually delete from backend after timeout if not undone (only in production)
      if (isSupabaseConfigured) {
        undoDeleteTimeout = setTimeout(async () => {
          if (lastDeletedAccount) {
            try {
              const { error } = await supabase.from('accounts').delete().eq('id', id);
              if (error) {
                console.error('❌ Error deleting account from backend:', error);
                toast({
                  title: 'Delete Failed',
                  description: error.message,
                  variant: 'destructive'
                });
              } else {
                console.log('✅ Successfully deleted account from backend');
              }
              lastDeletedAccount = null;
            } catch (error) {
              console.error('💥 Unexpected error deleting account:', error);
              errorHandler.handleError(error, 'Backend Delete Account');
            }
          }
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }, 5000);
      }
    },
    onError: (err: any) => {
      console.error('❌ Delete account failed:', err);
      errorHandler.handleError(err, 'Delete Account');
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
