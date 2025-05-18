
import { useState, useMemo, useEffect } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/auth'; // Updated import path
import { ExpenseItem } from '@/components/expenses/ExpenseCard';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useExpenseData = () => {
  const { currentWorkspace } = useWorkspace();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Fetch expenses from Supabase
  const fetchExpenses = async (): Promise<ExpenseItem[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      return data.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        expenseType: expense.expense_type
      }));
      
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Failed to load expenses",
        description: "There was an error loading your expenses. Please refresh the page.",
        variant: "destructive"
      });
      return [];
    }
  };
  
  // Use React Query to fetch expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: fetchExpenses,
    enabled: !!user
  });
  
  // Add new expense
  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Omit<ExpenseItem, 'id'>) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          expense_type: expense.expenseType,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expense added",
        description: "Your expense has been added successfully."
      });
    },
    onError: (error) => {
      console.error('Error adding expense:', error);
      toast({
        title: "Failed to add expense",
        description: "There was an error adding your expense. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Update an expense
  const updateExpenseMutation = useMutation({
    mutationFn: async (expense: ExpenseItem) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('expenses')
        .update({
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          expense_type: expense.expenseType
        })
        .eq('id', expense.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully."
      });
    },
    onError: (error) => {
      console.error('Error updating expense:', error);
      toast({
        title: "Failed to update expense",
        description: "There was an error updating your expense. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Delete an expense
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: number) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return expenseId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expense deleted",
        description: "Your expense has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
      toast({
        title: "Failed to delete expense",
        description: "There was an error deleting your expense. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Import expenses
  const importExpensesMutation = useMutation({
    mutationFn: async (newExpenses: ExpenseItem[]) => {
      if (!user) throw new Error("User not authenticated");
      
      // Format expenses for Supabase
      const expensesToInsert = newExpenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        expense_type: expense.expenseType,
        user_id: user.id,
        created_at: new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('expenses')
        .insert(expensesToInsert);
        
      if (error) throw error;
      return newExpenses;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expenses imported",
        description: `Successfully imported ${data.length} expenses.`
      });
    },
    onError: (error) => {
      console.error('Error importing expenses:', error);
      toast({
        title: "Failed to import expenses",
        description: "There was an error importing your expenses. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Filter expenses based on selected workspace and expense type
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Filter by search query
      if (searchQuery && !expense.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by workspace (show all if 'all' is selected)
      if (currentWorkspace !== 'all' && expense.category !== currentWorkspace) {
        return false;
      }
      
      // Filter by expense type
      if (expenseFilter !== 'all' && expense.expenseType !== expenseFilter) {
        return false;
      }
      
      // Filter by date if selected
      if (dateFilter) {
        const expenseDate = new Date(expense.date);
        if (expenseDate.toDateString() !== dateFilter.toDateString()) {
          return false;
        }
      }
      
      return true;
    });
  }, [currentWorkspace, expenseFilter, searchQuery, dateFilter, expenses]);
  
  // Sort expenses
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });
  }, [filteredExpenses, sortBy]);
  
  // Calculate total expenses
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [filteredExpenses]);
  
  // Get workspace display text
  const workspaceDisplay = useMemo(() => {
    return currentWorkspace === 'all' 
      ? 'All' 
      : currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1);
  }, [currentWorkspace]);

  return {
    searchQuery, 
    setSearchQuery,
    expenseFilter, 
    setExpenseFilter,
    advancedFiltersOpen, 
    setAdvancedFiltersOpen,
    dateFilter, 
    setDateFilter,
    sortBy, 
    setSortBy,
    expenses,
    filteredExpenses,
    sortedExpenses,
    totalAmount,
    workspaceDisplay,
    addExpense: (expense: Omit<ExpenseItem, 'id'>) => addExpenseMutation.mutate(expense),
    updateExpense: (expense: ExpenseItem) => updateExpenseMutation.mutate(expense),
    deleteExpense: (expenseId: number) => deleteExpenseMutation.mutate(expenseId),
    importExpenses: (newExpenses: ExpenseItem[]) => importExpensesMutation.mutate(newExpenses)
  };
};
