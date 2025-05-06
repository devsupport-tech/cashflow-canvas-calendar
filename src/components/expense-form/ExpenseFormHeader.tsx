
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionType } from '@/lib/types';

interface ExpenseFormHeaderProps {
  transactionType: TransactionType;
  onTransactionTypeChange: (type: TransactionType) => void;
}

export const ExpenseFormHeader: React.FC<ExpenseFormHeaderProps> = ({
  transactionType,
  onTransactionTypeChange
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-medium text-center">
        Add {transactionType === 'expense' ? 'Expense' : 'Income'}
      </h2>
      <Tabs value={transactionType} onValueChange={(value) => onTransactionTypeChange(value as TransactionType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
