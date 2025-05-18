
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface ExpenseSummaryProps {
  totalAmount: number;
  workspaceDisplay: string;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ 
  totalAmount, 
  workspaceDisplay 
}) => {
  return (
    <div className="mb-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Expense Summary
          </CardTitle>
          <CardDescription>
            Total Expenses ({workspaceDisplay}): <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
