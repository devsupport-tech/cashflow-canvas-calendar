
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { toast } from '@/components/ui/use-toast';
import { ExpenseSummary } from '@/components/expenses/ExpenseSummary';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { ExpenseActions } from '@/components/expenses/ExpenseActions';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { useExpenseData } from '@/hooks/useExpenseData';
import { ExpenseItem } from '@/components/expenses/ExpenseCard';

const Expenses = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  
  const {
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
    sortedExpenses,
    totalAmount,
    workspaceDisplay,
    updateExpense,
    deleteExpense,
    importExpenses
  } = useExpenseData();
  
  const handleEditExpense = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };
  
  const handleDeleteExpense = (expenseId: number) => {
    deleteExpense(expenseId);
  };

  const handleImportExpenses = (importedExpenses: ExpenseItem[]) => {
    importExpenses(importedExpenses);
  };
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your expenses
            </p>
          </div>
          
          <ExpenseActions
            formOpen={formOpen}
            setFormOpen={setFormOpen}
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
            expenses={sortedExpenses}
            onImport={handleImportExpenses}
          />
        </div>
        
        <ExpenseSummary 
          totalAmount={totalAmount}
          workspaceDisplay={workspaceDisplay}
        />
        
        <ExpenseFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expenseFilter={expenseFilter}
          setExpenseFilter={setExpenseFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          advancedFiltersOpen={advancedFiltersOpen}
          setAdvancedFiltersOpen={setAdvancedFiltersOpen}
        />
        
        <ExpenseList 
          expenses={sortedExpenses}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>
    </MainLayout>
  );
};

export default Expenses;
