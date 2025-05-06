
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, Filter, Wallet, Search, SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { CategoryBadge } from '@/components/CategoryBadge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/DatePicker';
import { toast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const Expenses = () => {
  const { currentWorkspace } = useWorkspace();
  const [formOpen, setFormOpen] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [editingExpense, setEditingExpense] = useState<typeof expenses[0] | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  
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
  
  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });
  
  // Calculate total expenses
  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  
  // Get workspace display text
  const workspaceDisplay = currentWorkspace === 'all' 
    ? 'All' 
    : currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1);
    
  const handleEditExpense = (expense: typeof expenses[0]) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };
  
  const handleDeleteExpense = (expenseId: number) => {
    // In a real app, this would delete the expense
    toast({
      title: "Expense Deleted",
      description: "The expense has been deleted successfully.",
    });
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Completed",
        description: "Your expenses have been exported successfully.",
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
        description: "Your expenses have been imported successfully.",
      });
    }, 1500);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setExpenseFilter('all');
    setDateFilter(undefined);
    setAdvancedFiltersOpen(false);
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
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
          
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={formOpen} onOpenChange={(open) => {
              setFormOpen(open);
              if (!open) setEditingExpense(null);
            }}>
              <DialogTrigger asChild>
                <Button className="gap-1 animate-fade-in">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <ExpenseForm 
                onClose={() => {
                  setFormOpen(false); 
                  setEditingExpense(null);
                }}
                initialExpense={editingExpense}
              />
            </Dialog>
            
            <Button 
              variant="outline" 
              className="gap-1" 
              onClick={handleImport} 
              isLoading={isImporting}
              disabled={isImporting}
            >
              {!isImporting && <Upload className="h-4 w-4" />}
              Import
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-1" 
              onClick={handleExport}
              isLoading={isExporting}
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
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filters</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Popover open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <SlidersHorizontal className="h-4 w-4" />
                      Advanced
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Advanced Filters</h4>
                        <p className="text-sm text-muted-foreground">
                          Fine-tune your expense list with these filters.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <DatePicker 
                          date={dateFilter} 
                          setDate={setDateFilter}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sort">Sort By</Label>
                        <Select 
                          value={sortBy} 
                          onValueChange={(value) => setSortBy(value as 'date' | 'amount')}
                        >
                          <SelectTrigger id="sort">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Date (newest first)</SelectItem>
                            <SelectItem value="amount">Amount (highest first)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={() => {
                        setAdvancedFiltersOpen(false);
                        toast({
                          title: "Filters Applied",
                          description: "Your expenses have been filtered based on your selections.",
                        });
                      }}>
                        Apply Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={expenseFilter} onValueChange={setExpenseFilter} className="w-full">
              <TabsList className="bg-background w-full flex-wrap h-auto py-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="transportation">Transportation</TabsTrigger>
                <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
                <TabsTrigger value="office">Office</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="space-y-4">
          {sortedExpenses.length > 0 ? (
            sortedExpenses.map((expense, index) => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                onEdit={() => handleEditExpense(expense)}
                onDelete={() => handleDeleteExpense(expense.id)}
                animationDelay={index * 0.05}
              />
            ))
          ) : (
            <Card className="animate-fade-in">
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
  onEdit: () => void;
  onDelete: () => void;
  animationDelay?: number;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  onEdit, 
  onDelete,
  animationDelay = 0
}) => {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <Card 
      className="card-hover animate-slide-up" 
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CategoryBadge category={expense.expenseType as any} />
            <div>
              <h3 className="font-medium">{expense.description}</h3>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Expenses;
