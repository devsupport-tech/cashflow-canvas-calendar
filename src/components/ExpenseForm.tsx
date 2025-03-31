
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ExpenseCategory, ExpenseType, TransactionType } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface ExpenseFormProps {
  onClose: () => void;
  initialDate?: Date;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onClose,
  initialDate
}) => {
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('personal');
  const [expenseType, setExpenseType] = useState<ExpenseType>('food');
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!description || !amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid form data",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    // Process submission
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      type: transactionType,
      category: transactionType === 'expense' ? category : undefined,
      expenseType: transactionType === 'expense' ? expenseType : undefined,
    };
    
    console.log('Transaction data:', transactionData);
    
    // Show success message
    toast({
      title: transactionType === 'expense' ? "Expense added" : "Income added",
      description: `${description} ($${amount}) was added successfully.`,
    });
    
    // Close the form
    onClose();
  };

  const expenseTypes: ExpenseType[] = [
    'food', 
    'transportation', 
    'housing', 
    'utilities', 
    'entertainment', 
    'shopping', 
    'health', 
    'education',
    'travel',
    'subscription',
    'office',
    'marketing',
    'other'
  ];

  return (
    <DialogContent className="sm:max-w-[425px] animate-in slide-up">
      <DialogHeader>
        <DialogTitle>
          {transactionType === 'expense' ? 'Add Expense' : 'Add Income'}
        </DialogTitle>
      </DialogHeader>
      
      <Tabs 
        value={transactionType} 
        onValueChange={(value) => setTransactionType(value as TransactionType)}
        className="w-full mb-4"
      >
        <TabsList className="w-full">
          <TabsTrigger value="expense" className="flex-1">Expense</TabsTrigger>
          <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {transactionType === 'expense' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ExpenseCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseType">Expense Type</Label>
              <Select
                value={expenseType}
                onValueChange={(value) => setExpenseType(value as ExpenseType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </DialogContent>
  );
};
