
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { useExpenseForm } from './expense-form/useExpenseForm';
import { ExpenseFormHeader } from './expense-form/ExpenseFormHeader';
import { BasicFormFields } from './expense-form/BasicFormFields';
import { ExpenseTypeFields } from './expense-form/ExpenseTypeFields';
import { FormActions } from './expense-form/FormActions';

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
