
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ExpenseCategory, ExpenseType, TransactionType } from '@/lib/types';

interface UseExpenseFormProps {
  onClose: () => void;
  initialDate?: Date;
}

export const useExpenseForm = ({ onClose, initialDate }: UseExpenseFormProps) => {
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

  return {
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
  };
};
