
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';

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
  workspace?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  icon,
  trend,
  className,
  showSign = false,
  workspace = false
}) => {
  const { currentWorkspace } = useWorkspace();
  
  // Format the amount as currency
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  return (
    <Card
      className={cn("overflow-hidden card-hover glass-card animate-scale-in focus-visible:ring-2 focus-visible:ring-primary", className)}
      role="region"
      aria-labelledby={`balance-card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      tabIndex={0}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 id={`balance-card-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-medium text-muted-foreground">{title}</h3>
              {workspace && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs", 
                    currentWorkspace === 'personal' ? "bg-violet-500/10 text-violet-500" : "bg-blue-500/10 text-blue-500"
                  )}
                >
                  {currentWorkspace}
                </Badge>
              )}
            </div>
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
          <div
            className={cn(
              "p-2 rounded-lg animate-float",
              currentWorkspace === 'personal'
                ? "bg-gradient-to-br from-violet-500 to-purple-600"
                : "bg-gradient-to-br from-blue-500 to-cyan-600"
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
