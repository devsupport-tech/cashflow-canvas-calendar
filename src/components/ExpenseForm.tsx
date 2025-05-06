
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
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onClose,
  initialDate
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
  } = useExpenseForm({ onClose, initialDate });

  return (
    <DialogContent className="sm:max-w-[425px] animate-in slide-up">
      <ExpenseFormHeader 
        transactionType={transactionType} 
        onTransactionTypeChange={setTransactionType} 
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicFormFields 
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          date={date}
          setDate={setDate}
        />
        
        {/* Always show category selection for both expense and income */}
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
        
        {/* Only show expense type for expenses */}
        {transactionType === 'expense' && (
          <ExpenseTypeFields 
            category={category}
            setCategory={setCategory}
            expenseType={expenseType}
            setExpenseType={setExpenseType}
          />
        )}
        
        <FormActions onCancel={onClose} />
      </form>
    </DialogContent>
  );
};
