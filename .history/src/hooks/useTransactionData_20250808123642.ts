
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Transaction } from '@/lib/types';

// Type alias for consistency with existing code
type TransactionItem = Transaction & {
  created_at: string;
};

// Local storage key for caching transactions
const TRANSACTIONS_CACHE_KEY = 'cashflow_transactions_cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: TransactionItem[];
  timestamp: number;
}

export const useTransactionData = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  // Load cached data from localStorage
  const loadCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(TRANSACTIONS_CACHE_KEY);
      if (cached) {
        const { data, timestamp }: CachedData = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_EXPIRY_MS;
        
        if (!isExpired) {
          console.log('📱 Loading cached transactions:', data.length);
          setTransactions(data);
          setLastSync(new Date(timestamp));
          return true;
        } else {
          console.log('⏰ Cache expired, will fetch fresh data');
          localStorage.removeItem(TRANSACTIONS_CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn('⚠️ Error loading cached transactions:', error);
      localStorage.removeItem(TRANSACTIONS_CACHE_KEY);
    }
    return false;
  }, []);

  // Save data to cache
  const saveToCache = useCallback((data: TransactionItem[]) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(TRANSACTIONS_CACHE_KEY, JSON.stringify(cacheData));
      setLastSync(new Date());
    } catch (error) {
      console.warn('⚠️ Error saving transactions to cache:', error);
    }
  }, []);

  // Fetch transactions from Supabase with improved error handling
  const fetchTransactions = useCallback(async (showToast = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured) {
        console.log('🔄 Using demo mode - loading mock transactions');
        const mockTransactions: TransactionItem[] = [
          {
            id: 'demo-1',
            description: 'Demo Income',
            amount: 5000,
            type: 'income',
            date: new Date().toISOString(),
            category: 'personal',
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-2',
            description: 'Demo Expense',
            amount: 150,
            type: 'expense',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            category: 'personal',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        setTransactions(mockTransactions);
        saveToCache(mockTransactions);
        setIsLoading(false);
        return;
      }

      // Try primary 'transactions' table, fall back to 'expenses' when not available
      let transactionData: any[] = [];
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) {
        console.warn('⚠️ transactions table not available or fetch error, falling back to expenses:', fetchError?.message);
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (expensesError) {
          console.error('❌ Error fetching expenses fallback:', expensesError);
          setError(expensesError.message);
          const hasCached = loadCachedData();
          if (!hasCached && showToast) {
            toast({
              title: "Connection Error",
              description: "Failed to fetch transactions. Using offline data if available.",
              variant: "destructive",
              duration: 5000,
            });
          }
          return;
        }

        // Map expenses rows to TransactionItem shape
        transactionData = (expensesData || []).map((row: any) => ({
          id: String(row.id),
          description: row.description,
          amount: row.amount,
          date: row.date,
          category: row.category,
          expenseType: row.expense_type,
          type: row.expense_type === 'income' ? 'income' : 'expense',
          created_at: row.created_at,
        }));
      } else {
        transactionData = data || [];
      }
      setTransactions(transactionData);
      saveToCache(transactionData);
      
      if (showToast && transactionData.length > 0) {
        toast({
          title: "Data Synced",
          description: `Loaded ${transactionData.length} transactions`,
          duration: 2000,
        });
      }
    } catch (err: any) {
      console.error('💥 Error in fetchTransactions:', err);
      setError(err.message || 'Failed to fetch transactions');
      
      // Fallback to cached data
      const hasCached = loadCachedData();
      if (!hasCached && showToast) {
        toast({
          title: "Error",
          description: "Failed to load transactions. Please check your connection.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupabaseConfigured, loadCachedData, saveToCache]);

  // Add new transaction with optimistic updates
  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<TransactionItem, 'id' | 'created_at'>) => {
      const tempId = 'temp-' + Date.now();
      const newTransaction: TransactionItem = {
        ...transaction,
        id: tempId,
        created_at: new Date().toISOString()
      };

      // Optimistic update
      setTransactions(prev => [newTransaction, ...prev]);

      try {
        if (!isSupabaseConfigured) {
          // In demo mode, just update the ID and save to cache
          const finalTransaction = { ...newTransaction, id: 'demo-' + Date.now() };
          setTransactions(prev => 
            prev.map(t => t.id === tempId ? finalTransaction : t)
          );
          saveToCache([finalTransaction, ...transactions.filter(t => t.id !== tempId)]);
          
          toast({
            title: "Success (Demo)",
            description: "Transaction added successfully in demo mode",
          });
          return finalTransaction;
        }
        
        // Handle real Supabase operations here, try transactions then expenses
        const baseInsert = {
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          category: transaction.category,
          // Map expenseType/type for expenses fallback
          expense_type:
            transaction.type === 'income' ? 'income' : (transaction as any).expenseType,
          user_id: user?.id || null,
          created_at: new Date().toISOString(),
        } as any;

        let inserted: any = null;
        let insertError: any = null;

        // Try primary transactions table
        const { data: tData, error: tError } = await supabase
          .from('transactions')
          .insert([ { ...transaction, user_id: user?.id } as any ])
          .select()
          .single();

        if (tError) {
          // Fallback to expenses
          const { data: eData, error: eError } = await supabase
            .from('expenses')
            .insert([ baseInsert ])
            .select()
            .single();
          inserted = eData;
          insertError = eError;
        } else {
          inserted = tData;
          insertError = null;
        }

        if (insertError) throw insertError;
        
        // Normalize to TransactionItem
        const finalTransaction: TransactionItem = inserted && inserted.expense_type !== undefined
          ? {
              id: String(inserted.id),
              description: inserted.description,
              amount: inserted.amount,
              date: inserted.date,
              category: inserted.category,
              expenseType: inserted.expense_type,
              type: inserted.expense_type === 'income' ? 'income' : 'expense',
              created_at: inserted.created_at,
            }
          : (inserted as TransactionItem);
        setTransactions(prev => 
          prev.map(t => t.id === tempId ? finalTransaction : t)
        );
        saveToCache([finalTransaction, ...transactions.filter(t => t.id !== tempId)]);
        
        toast({
          title: "Success",
          description: "Transaction added successfully",
        });
        return finalTransaction;
        
      } catch (error) {
        // Revert optimistic update on error
        setTransactions(prev => prev.filter(t => t.id !== tempId));
        throw error;
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add transaction: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  // Update transaction
  const updateTransactionMutation = useMutation({
    // Accept a full transaction-like object, as called from the form
    mutationFn: async (updated: Partial<TransactionItem> & { id?: string }) => {
      const id = updated.id as string;
      // Optimistic update
      const previousTransactions = transactions;
      setTransactions(prev => 
        prev.map(t => t.id === id ? { ...t, ...updates } : t)
      );

      try {
        if (!isSupabaseConfigured) {
          // In demo mode, just save to cache
          const updatedTransactions = transactions.map(t => 
            t.id === id ? { ...t, ...updates } : t
          );
          saveToCache(updatedTransactions);
          
          toast({
            title: "Success (Demo)",
            description: "Transaction updated successfully in demo mode",
          });
          return;
        }
        
        let updateErr: any = null;

        const { error: tUpdErr } = await supabase
          .from('transactions')
          .update({
            description: updated.description,
            amount: updated.amount,
            date: updated.date,
            category: updated.category,
            expenseType: (updated as any).expenseType,
            type: (updated as any).type,
          } as any)
          .eq('id', id);

        if (tUpdErr) {
          const { error: eUpdErr } = await supabase
            .from('expenses')
            .update({
              description: updated.description,
              amount: updated.amount,
              date: updated.date,
              category: updated.category,
              expense_type: (updated as any).type === 'income' ? 'income' : (updated as any).expenseType,
            } as any)
            .eq('id', Number(id));
          updateErr = eUpdErr;
        } else {
          updateErr = null;
        }

        if (updateErr) throw updateErr;
        
        // Save to cache
        const updatedTransactions = transactions.map(t => 
          t.id === id ? { ...t, ...updated } as TransactionItem : t
        );
        saveToCache(updatedTransactions);
        
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
        
      } catch (error) {
        // Revert optimistic update on error
        setTransactions(previousTransactions);
        throw error;
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update transaction: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  // Delete transaction
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      let delErr: any = null;
      const { error: tDelErr } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (tDelErr) {
        const { error: eDelErr } = await supabase
          .from('expenses')
          .delete()
          .eq('id', Number(id))
          .eq('user_id', user.id);
        delErr = eDelErr;
      } else {
        delErr = null;
      }

      if (delErr) throw delErr;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id, currentWorkspace] });
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
