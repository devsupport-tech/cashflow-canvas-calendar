
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
  
  // Dummy budgets - in a real app, these would be fetched from an API
  const budgets = [
    { 
      id: 1, 
      name: 'Groceries', 
      amount: 500, 
      spent: 325.42, 
      category: 'personal',
      trend: 'up' 
    },
    { 
      id: 2, 
      name: 'Entertainment', 
      amount: 200, 
      spent: 178.65, 
      category: 'personal',
      trend: 'down' 
    },
    { 
      id: 3, 
      name: 'Office Supplies', 
      amount: 300, 
      spent: 120.33, 
      category: 'business',
      trend: 'down' 
    },
    { 
      id: 4, 
      name: 'Marketing', 
      amount: 1000, 
      spent: 850.75, 
      category: 'business',
      trend: 'up' 
    },
    { 
      id: 5, 
      name: 'Travel', 
      amount: 800, 
      spent: 250.50, 
      category: 'personal',
      trend: 'down' 
    },
    { 
      id: 6, 
      name: 'Software Subscriptions', 
      amount: 450, 
      spent: 375.00, 
      category: 'business',
      trend: 'flat' 
    },
  ];
  
  // Filter budgets based on selected workspace
  const filteredBudgets = currentWorkspace === 'all' 
    ? budgets 
    : budgets.filter(budget => budget.category === currentWorkspace);
  
  // Calculate total budget and spent
  const totalBudget = filteredBudgets.reduce((total, budget) => total + budget.amount, 0);
  const totalSpent = filteredBudgets.reduce((total, budget) => total + budget.spent, 0);
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const handleEditBudget = (budget: typeof budgets[0]) => {
    setEditBudgetId(budget.id);
    setFormData({
      name: budget.name,
      amount: budget.amount.toString(),
      category: budget.category as ExpenseCategory,
    });
    setAddBudgetOpen(true);
  };
  
  const handleDeleteBudget = (budgetId: number) => {
    toast({
      title: "Budget Deleted",
      description: "The budget has been deleted successfully.",
    });
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
          {filteredBudgets.map((budget, index) => (
            <BudgetCard 
              key={budget.id} 
              budget={budget}
              onEdit={() => handleEditBudget(budget)}
              onDelete={() => handleDeleteBudget(budget.id)}
              animationDelay={index * 0.05}
              workspaceOptions={workspaceOptions}
            />
          ))}
          
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
