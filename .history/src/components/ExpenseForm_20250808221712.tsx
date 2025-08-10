
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { useExpenseForm } from './expense-form/useExpenseForm';
import { ExpenseFormHeader } from './expense-form/ExpenseFormHeader';
import { BasicFormFields } from './expense-form/BasicFormFields';
import { ExpenseTypeFields } from './expense-form/ExpenseTypeFields';
import { FormActions } from './expense-form/FormActions';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseCategory } from '@/lib/types';

interface ExpenseFormProps {
  onClose: () => void;
  initialDate?: Date;
  initialExpense?: {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
    expenseType: string;
  } | null;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onClose,
  initialDate,
  initialExpense
}) => {
  const {
    date,
    setDate,
    description,
    setDescription,
    amount,
    setAmount,
    category,
    setCategory,
    expenseType,
    setExpenseType,
    transactionType,
    setTransactionType,
    handleSubmit,
  } = useExpenseForm({ 
    onClose,
    initialDate,
    initialExpense
  });

  return (
    <DialogContent
      className="sm:max-w-[425px] animate-in slide-up"
      aria-labelledby="expense-form-dialog-title"
      aria-describedby="expense-form-dialog-description"
    >
      <ExpenseFormHeader 
        transactionType={transactionType} 
        onTransactionTypeChange={setTransactionType}
        isEditing={!!initialExpense} 
      />
      {/* Add visually hidden heading and description for accessibility */}
      <h2 id="expense-form-dialog-title" className="sr-only">{initialExpense ? 'Edit Expense' : 'Add Expense'}</h2>
      <p id="expense-form-dialog-description" className="sr-only">{initialExpense ? 'Update your expense details below.' : 'Add a new expense to your records.'}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicFormFields 
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          date={date}
          setDate={setDate}
        />
        
        {/* Show category for income here; for expense it's shown with expense type below */}
        {transactionType !== 'expense' && (
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
        )}
        
        {/* Only show expense type for expenses */}
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
            <ExpenseTypeFields 
              expenseType={expenseType}
              setExpenseType={setExpenseType}
            />
          </>
        )}
        
        <FormActions onCancel={onClose} isEditing={!!initialExpense} />
      </form>
    </DialogContent>
  );
};
