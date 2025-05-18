
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PiggyBank } from 'lucide-react';

interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  percentSpent: number;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  totalBudget,
  totalSpent,
  percentSpent
}) => {
  return (
    <div className="mb-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            Budget Summary
          </CardTitle>
          <CardDescription>
            Total Budget: ${totalBudget.toFixed(2)} | Spent: ${totalSpent.toFixed(2)} ({percentSpent.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={percentSpent} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
