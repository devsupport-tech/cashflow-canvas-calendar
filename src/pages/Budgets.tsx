
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ExpenseCategory, WorkspaceOption } from '@/lib/types';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { BudgetForm } from '@/components/budgets/BudgetForm';
import { BudgetSummary } from '@/components/budgets/BudgetSummary';
import { BudgetActions } from '@/components/budgets/BudgetActions';
import { toast } from '@/components/ui/use-toast';
import { useBudgetData } from '@/hooks/useBudgetData';

const Budgets = () => {
  const { currentWorkspace, workspaceOptions } = useWorkspace();
  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editBudgetId, setEditBudgetId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: (currentWorkspace !== 'all' ? currentWorkspace : 'personal') as ExpenseCategory,
  });
  
  // Use backend budgets from Supabase
  const { budgets, isLoading, error, addBudget, updateBudget, deleteBudget } = useBudgetData();

  // Filter budgets based on selected workspace
  const filteredBudgets = currentWorkspace === 'all'
    ? budgets
    : budgets.filter(budget => budget.category === currentWorkspace);

  // Calculate total budget and spent
  const totalBudget = filteredBudgets.reduce((total, budget) => total + (budget.amount || 0), 0);
  const totalSpent = filteredBudgets.reduce((total, budget) => total + (budget.spent || 0), 0);
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const handleEditBudget = (budget: any) => {
    setEditBudgetId(parseInt(budget.id, 10));
    setFormData({
      name: budget.name,
      amount: budget.amount?.toString() ?? '',
      category: budget.category as ExpenseCategory,
    });
    setAddBudgetOpen(true);
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId);
      toast({
        title: "Budget Deleted",
        description: "The budget has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete budget.",
        variant: "destructive",
      });
    }
  };

  // Find the category options based on workspaces (excluding 'all')
  const categoryOptions: WorkspaceOption[] = workspaceOptions.filter(option => 
    option.value === 'personal' || option.value !== 'all'
  );
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your budget allocations
            </p>
          </div>
          
          <BudgetActions 
            setAddBudgetOpen={setAddBudgetOpen}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
            isImporting={isImporting}
            setIsImporting={setIsImporting}
          />
        </div>
        
        <BudgetSummary 
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          percentSpent={percentSpent}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              {/* Premium animated skeletons matching BudgetCard layout */}
              {[1,2,3,4].map(i => (
                <div key={i} className="col-span-2 md:col-span-1 animate-fade-in">
                  <div className="flex flex-col gap-3 p-6 bg-gradient-to-r from-muted to-secondary/80 rounded-lg animate-pulse h-[200px]">
                    <div className="h-5 w-1/3 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-1/2 rounded bg-muted-foreground/10 mb-2" />
                    <div className="flex-1" />
                    <div className="flex gap-2">
                      <div className="h-8 w-20 rounded bg-muted-foreground/10" />
                      <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : error ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-8 text-destructive animate-fade-in">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-2 animate-bounce">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
              <div>Failed to load budgets.</div>
              <button className="mt-2 underline" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : filteredBudgets.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 animate-fade-in">
              <img src="/assets/budget-empty.svg" alt="No budgets" className="w-24 h-24 mb-4 opacity-80" aria-hidden="true" />
              <div className="font-semibold text-lg mb-2">No budgets yet</div>
              <div className="text-muted-foreground mb-4">Create your first budget to start tracking your spending!</div>
              <Button onClick={() => setAddBudgetOpen(true)} autoFocus>
                <Plus className="h-4 w-4" /> Add Budget
              </Button>
            </div>
          ) : (
            filteredBudgets.map((budget, index) => (
              <div key={budget.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <BudgetCard 
                  budget={{
                    ...budget,
                    id: parseInt(budget.id, 10) // Convert string id to number for BudgetCard
                  }}
                  onEdit={() => handleEditBudget(budget)}
                  onDelete={() => handleDeleteBudget(budget.id)}
                  animationDelay={index * 0.05}
                  workspaceOptions={workspaceOptions}
                />
              </div>
            ))
          )}

          <Card className="border-dashed border-2 flex items-center justify-center h-[200px] card-hover animate-fade-in">
            <Button variant="ghost" className="gap-2" onClick={() => {
              setAddBudgetOpen(true);
              setEditBudgetId(null);
              setFormData({ 
                name: '', 
                amount: '', 
                category: (currentWorkspace !== 'all' ? currentWorkspace : 'personal') as ExpenseCategory 
              });
            }}>
              <Plus className="h-5 w-5" />
              Add New Budget
            </Button>
          </Card>
        </div>
        
        <BudgetForm 
          open={addBudgetOpen}
          setOpen={setAddBudgetOpen}
          formData={formData}
          setFormData={setFormData}
          editBudgetId={editBudgetId}
          setEditBudgetId={setEditBudgetId}
          categoryOptions={categoryOptions}
        />
      </div>
    </MainLayout>
  );
};

export default Budgets;
