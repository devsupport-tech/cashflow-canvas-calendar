
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ExpenseCategory, ExpenseType, TransactionType } from '@/lib/types';

interface UseExpenseFormProps {
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

export const useExpenseForm = ({ onClose, initialDate, initialExpense }: UseExpenseFormProps) => {
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('personal');
  const [expenseType, setExpenseType] = useState<ExpenseType>('food');
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');

  // If editing an existing expense, populate the form
  useEffect(() => {
    if (initialExpense) {
      setDescription(initialExpense.description);
      setAmount(initialExpense.amount.toString());
      setCategory(initialExpense.category as ExpenseCategory);
      setExpenseType(initialExpense.expenseType as ExpenseType);
      setDate(new Date(initialExpense.date));
      // Transaction type would typically be set based on initialExpense.type if that property existed
    }
  }, [initialExpense]);

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
      id: initialExpense?.id,
      description,
      amount: parseFloat(amount),
      date,
      type: transactionType,
      category: category,
      expenseType: transactionType === 'expense' ? expenseType : undefined,
    };
    
    console.log('Transaction data:', transactionData);
    
    // Show success message
    toast({
      title: initialExpense 
        ? `${transactionType === 'expense' ? 'Expense' : 'Income'} updated` 
        : `${transactionType === 'expense' ? 'Expense' : 'Income'} added`,
      description: `${description} ($${amount}) was ${initialExpense ? 'updated' : 'added'} successfully.`,
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
