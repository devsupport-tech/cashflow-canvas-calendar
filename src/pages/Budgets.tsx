
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, PiggyBank, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const Budgets = () => {
  const { currentWorkspace } = useWorkspace();
  const [addBudgetOpen, setAddBudgetOpen] = React.useState(false);
  
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
  const filteredBudgets = budgets.filter(budget => 
    budget.category === currentWorkspace
  );
  
  // Calculate total budget and spent
  const totalBudget = filteredBudgets.reduce((total, budget) => total + budget.amount, 0);
  const totalSpent = filteredBudgets.reduce((total, budget) => total + budget.spent, 0);
  const percentSpent = (totalSpent / totalBudget) * 100;
  
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
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Create Budget
                </Button>
              </DialogTrigger>
              {/* Budget form will go here in a future update */}
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
          {filteredBudgets.map(budget => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
          
          <Card className="border-dashed border-2 flex items-center justify-center h-[200px] card-hover animate-fade-in">
            <Button variant="ghost" className="gap-2" onClick={() => setAddBudgetOpen(true)}>
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
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  const percentSpent = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;
  
  return (
    <Card className="card-hover animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{budget.name}</CardTitle>
          <Badge 
            variant="outline" 
            className={`
              ${budget.category === 'business' ? 'bg-ocean-blue text-white' : 'bg-bright-orange text-white'}
            `}
          >
            {budget.category}
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
            <span className={`font-medium ${percentSpent > 90 ? 'text-red-500' : percentSpent > 75 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {percentSpent.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={percentSpent} 
            className={`h-2 ${
              percentSpent > 90 ? 'bg-red-100' : 
              percentSpent > 75 ? 'bg-amber-100' : 
              'bg-emerald-100'
            }`} 
            indicatorClassName={`${
              percentSpent > 90 ? 'bg-red-500' : 
              percentSpent > 75 ? 'bg-amber-500' : 
              'bg-emerald-500'
            }`}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Remaining: <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-foreground'}`}>
            ${remaining.toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs">View Transactions</Button>
      </CardFooter>
    </Card>
  );
};

export default Budgets;
