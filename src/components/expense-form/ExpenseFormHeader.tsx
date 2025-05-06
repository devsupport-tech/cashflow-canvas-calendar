
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionType } from '@/lib/types';

interface ExpenseFormHeaderProps {
  transactionType: TransactionType;
  onTransactionTypeChange: (value: TransactionType) => void;
}

export const ExpenseFormHeader: React.FC<ExpenseFormHeaderProps> = ({
  transactionType,
  onTransactionTypeChange
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {transactionType === 'expense' ? 'Add Expense' : 'Add Income'}
        </DialogTitle>
      </DialogHeader>
      
      <Tabs 
        value={transactionType} 
        onValueChange={(value) => onTransactionTypeChange(value as TransactionType)}
        className="w-full mb-4"
      >
        <TabsList className="w-full">
          <TabsTrigger value="expense" className="flex-1">Expense</TabsTrigger>
          <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};
