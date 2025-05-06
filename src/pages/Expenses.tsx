
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, Filter, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { CategoryBadge } from '@/components/CategoryBadge';

const Expenses = () => {
  const { currentWorkspace } = useWorkspace();
  const [formOpen, setFormOpen] = React.useState(false);
  const [expenseFilter, setExpenseFilter] = React.useState('all');
  
  const expenses = [
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
  
  // Filter expenses based on selected workspace and expense type
  const filteredExpenses = expenses.filter(expense => {
    // Filter by workspace (show all if 'all' is selected)
    if (currentWorkspace !== 'all' && expense.category !== currentWorkspace) {
      return false;
    }
    
    // Filter by expense type
    if (expenseFilter !== 'all' && expense.expenseType !== expenseFilter) {
      return false;
    }
    
    return true;
  });
  
  // Calculate total expenses
  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  
  // Get workspace display text
  const workspaceDisplay = currentWorkspace === 'all' 
    ? 'All' 
    : currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1);
  
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
          
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <ExpenseForm onClose={() => setFormOpen(false)} />
            </Dialog>
            
            <Button variant="outline" className="gap-1">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Expense Summary
              </CardTitle>
              <CardDescription>
                Total Expenses ({workspaceDisplay}): <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="bg-muted/40 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <h3 className="text-sm font-medium">Filters</h3>
            
            <Tabs value={expenseFilter} onValueChange={setExpenseFilter} className="border rounded-md bg-background">
              <TabsList className="bg-transparent">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="transportation">Transportation</TabsTrigger>
                <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
                <TabsTrigger value="office">Office</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="ghost" size="sm" className="ml-auto gap-1">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No expenses found matching the current filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

interface ExpenseCardProps {
  expense: {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
    expenseType: string;
  };
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <Card className="card-hover animate-slide-up">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CategoryBadge category={expense.expenseType as any} />
            <div>
              <h3 className="font-medium">{expense.description}</h3>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg text-red-500">
              -${expense.amount.toFixed(2)}
            </p>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                expense.category === 'business' ? 'bg-ocean-blue text-white' : 
                'bg-bright-orange text-white'
              }`}
            >
              {expense.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Expenses;
