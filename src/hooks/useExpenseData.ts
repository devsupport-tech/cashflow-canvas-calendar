
import { useState, useMemo, useEffect } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ExpenseItem } from '@/components/expenses/ExpenseCard';

export const useExpenseData = () => {
  const { currentWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  
  // Load expenses from localStorage or use defaults
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        return JSON.parse(savedExpenses);
      } catch (e) {
        console.error("Failed to parse saved expenses:", e);
      }
    }
    
    // Default expenses
    return [
      { 
        id: 1, 
        description: 'Weekly Groceries', 
        amount: 125.42, 
        date: '2023-06-15', 
        category: 'personal',
        expenseType: 'food'
      },
      { 
        id: 2, 
        description: 'Netflix Subscription', 
        amount: 15.99, 
        date: '2023-06-12', 
        category: 'personal',
        expenseType: 'subscription'
      },
      { 
        id: 3, 
        description: 'Adobe Creative Cloud', 
        amount: 52.99, 
        date: '2023-06-10', 
        category: 'business',
        expenseType: 'subscription'
      },
      { 
        id: 4, 
        description: 'Client Meeting Lunch', 
        amount: 78.25, 
        date: '2023-06-08', 
        category: 'business',
        expenseType: 'food'
      },
      { 
        id: 5, 
        description: 'Office Supplies', 
        amount: 34.56, 
        date: '2023-06-05', 
        category: 'business',
        expenseType: 'office'
      },
      { 
        id: 6, 
        description: 'Uber Ride', 
        amount: 22.15, 
        date: '2023-06-02', 
        category: 'personal',
        expenseType: 'transportation'
      },
    ];
  });
  
  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  // Add new expense
  const addExpense = (expense: ExpenseItem) => {
    setExpenses(prev => [...prev, expense]);
  };
  
  // Update an expense
  const updateExpense = (updatedExpense: ExpenseItem) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };
  
  // Delete an expense
  const deleteExpense = (expenseId: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  };
  
  // Import expenses
  const importExpenses = (newExpenses: ExpenseItem[]) => {
    // Check for potential duplicates by ID
    const existingIds = new Set(expenses.map(e => e.id));
    const uniqueNewExpenses = newExpenses.map(expense => {
      // If ID already exists, create a new one
      if (existingIds.has(expense.id)) {
        return { ...expense, id: Math.floor(Math.random() * 1000000) };
      }
      return expense;
    });
    
    setExpenses(prev => [...prev, ...uniqueNewExpenses]);
  };
  
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
    addExpense,
    updateExpense,
    deleteExpense,
    importExpenses
  };
};
