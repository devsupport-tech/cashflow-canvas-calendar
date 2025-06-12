
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ExpenseCategory, ExpenseType, TransactionType } from '@/lib/types';
import { useTransactionData } from '@/hooks/useTransactionData';

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

  const { addTransaction, updateTransaction } = useTransactionData();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    const transactionData = {
      id: initialExpense?.id?.toString(),
      description,
      amount: parseFloat(amount),
      date: date instanceof Date ? date.toISOString() : date,
      type: transactionType,
      category: category,
      expenseType: transactionType === 'expense' ? expenseType : undefined,
      tags: [],
    };
    try {
      if (initialExpense) {
        await updateTransaction(transactionData);
      } else {
        await addTransaction(transactionData);
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to save transaction",
        description: error?.message || 'Could not save transaction.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
