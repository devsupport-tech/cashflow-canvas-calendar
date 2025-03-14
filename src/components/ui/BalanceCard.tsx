
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  showSign?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  icon,
  trend,
  className,
  showSign = false
}) => {
  // Format the amount as currency
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
            <p className={cn(
              "text-2xl font-semibold tracking-tight",
              amount < 0 && "text-destructive"
            )}>
              {showSign && amount > 0 ? '+' : ''}{formattedAmount}
            </p>
            {trend && (
              <p className={cn(
                "text-xs mt-1",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}% from last month
              </p>
            )}
          </div>
          <div className="bg-primary/10 p-2 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
