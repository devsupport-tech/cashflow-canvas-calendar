
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpenseCategory, ExpenseType } from '@/lib/types';

interface ExpenseTypeFieldsProps {
  category: ExpenseCategory;
  setCategory: (value: ExpenseCategory) => void;
  expenseType: ExpenseType;
  setExpenseType: (value: ExpenseType) => void;
}

export const ExpenseTypeFields: React.FC<ExpenseTypeFieldsProps> = ({
  category,
  setCategory,
  expenseType,
  setExpenseType
}) => {
  // Define the list of expense types
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
  );
};
