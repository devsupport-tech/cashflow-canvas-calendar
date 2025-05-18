
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseCard, ExpenseItem } from './ExpenseCard';

interface ExpenseListProps {
  expenses: ExpenseItem[];
  onEditExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (expenseId: number) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  onEditExpense, 
  onDeleteExpense 
}) => {
  return (
    <div className="space-y-4">
      {expenses.length > 0 ? (
        expenses.map((expense, index) => (
          <ExpenseCard 
            key={expense.id} 
            expense={expense} 
            onEdit={() => onEditExpense(expense)}
            onDelete={() => onDeleteExpense(expense.id)}
            animationDelay={index * 0.05}
          />
        ))
      ) : (
        <Card className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No expenses found matching the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
