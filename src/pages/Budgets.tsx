
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, PiggyBank, TrendingUp, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ExpenseCategory } from '@/lib/types';

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
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: editBudgetId ? "Budget Updated" : "Budget Created",
      description: `${formData.name} budget has been ${editBudgetId ? "updated" : "created"} successfully.`,
    });
    
    // Reset form and close dialog
    setFormData({ 
      name: '', 
      amount: '', 
      category: (currentWorkspace !== 'all' ? currentWorkspace : 'personal') as ExpenseCategory 
    });
    setAddBudgetOpen(false);
    setEditBudgetId(null);
  };
  
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
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Completed",
        description: "Your budgets have been exported successfully.",
      });
    }, 1500);
  };
  
  const handleImport = () => {
    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Import Completed",
        description: "Your budgets have been imported successfully.",
      });
    }, 1500);
  };

  // Find the category options based on workspaces
  const categoryOptions = workspaceOptions.filter(option => 
    option.value === 'personal' || 
    option.value !== 'all'
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
          
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={addBudgetOpen} onOpenChange={setAddBudgetOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1 animate-fade-in">
                  <Plus className="h-4 w-4" />
                  Create Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editBudgetId ? "Edit Budget" : "Create New Budget"}</DialogTitle>
                  <DialogDescription>
                    {editBudgetId ? "Update your budget details below." : "Add a new budget to track your expenses."}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Budget Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Groceries, Rent, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monthly Amount</Label>
                    <Input 
                      id="amount" 
                      value={formData.amount} 
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({...formData, category: value as ExpenseCategory})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value.toString()} value={option.value.toString()}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => {
                      setAddBudgetOpen(false);
                      setFormData({ 
                        name: '', 
                        amount: '', 
                        category: (currentWorkspace !== 'all' ? currentWorkspace : 'personal') as ExpenseCategory 
                      });
                      setEditBudgetId(null);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editBudgetId ? "Update Budget" : "Create Budget"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              className="gap-1" 
              onClick={handleImport}
              disabled={isImporting}
            >
              {!isImporting && <Upload className="h-4 w-4" />}
              Import
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-1" 
              onClick={handleExport}
              disabled={isExporting}
            >
              {!isExporting && <Download className="h-4 w-4" />}
              Export
            </Button>
          </div>
        </div>
        
        <div className="mb-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                Budget Summary
              </CardTitle>
              <CardDescription>
                Total Budget: ${totalBudget.toFixed(2)} | Spent: ${totalSpent.toFixed(2)} ({percentSpent.toFixed(1)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={percentSpent} className="h-2" />
            </CardContent>
          </Card>
        </div>
        
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
      </div>
    </MainLayout>
  );
};

interface BudgetCardProps {
  budget: {
    id: number;
    name: string;
    amount: number;
    spent: number;
    category: string;
    trend: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  animationDelay?: number;
  workspaceOptions: { value: string; label: string; color: string }[];
}

const BudgetCard: React.FC<BudgetCardProps> = ({ 
  budget, 
  onEdit, 
  onDelete, 
  animationDelay = 0,
  workspaceOptions
}) => {
  const percentSpent = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;
  
  // Find the workspace option for the budget category
  const categoryOption = workspaceOptions.find(option => option.value.toString() === budget.category) || {
    value: budget.category,
    label: budget.category === 'personal' ? 'Personal' : 'Business',
    color: budget.category === 'personal' ? 'bg-violet-500' : 'bg-blue-500'
  };
  
  // Determine color based on percentage spent
  const getColorClass = () => {
    if (percentSpent > 90) return 'text-red-500';
    if (percentSpent > 75) return 'text-amber-500';
    return 'text-emerald-500';
  };
  
  const getProgressBgClass = () => {
    if (percentSpent > 90) return 'bg-red-100';
    if (percentSpent > 75) return 'bg-amber-100';
    return 'bg-emerald-100';
  };
  
  const getProgressIndicatorClass = () => {
    if (percentSpent > 90) return 'bg-red-500';
    if (percentSpent > 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };
  
  return (
    <Card 
      className="card-hover animate-slide-up" 
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{budget.name}</CardTitle>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${categoryOption.color} text-white`}
          >
            <div className="w-2 h-2 rounded-full bg-white/80" />
            {categoryOption.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          Monthly Budget
          {budget.trend === 'up' && <ArrowUp className="h-3 w-3 text-red-500" />}
          {budget.trend === 'down' && <ArrowDown className="h-3 w-3 text-emerald-500" />}
          {budget.trend === 'flat' && <TrendingUp className="h-3 w-3 text-muted-foreground" />}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>
              <span className="font-medium">${budget.spent.toFixed(2)}</span> of ${budget.amount.toFixed(2)}
            </span>
            <span className={`font-medium ${getColorClass()}`}>
              {percentSpent.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={percentSpent} 
            className={`h-2 ${getProgressBgClass()}`}
            indicatorClassName={getProgressIndicatorClass()}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Remaining: <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-foreground'}`}>
            ${remaining.toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs">View Transactions</Button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Budgets;
