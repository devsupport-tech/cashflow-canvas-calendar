
import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '@/lib/types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryBadge } from './CategoryBadge';
import { buttonVariants } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              transaction.type === 'income' ? "bg-income/10" : "bg-destructive/10"
            )}>
              {transaction.type === 'income' 
                ? <ArrowUpRight className="h-4 w-4 text-income" /> 
                : <ArrowDownLeft className="h-4 w-4 text-destructive" />
              }
            </div>
            <div>
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {format(transaction.date, "MMM d")}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <p className={cn(
              "font-medium text-sm",
              transaction.type === 'income' ? "text-income" : "text-destructive"
            )}>
              {transaction.type === 'income' ? '+' : '-'}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(transaction.amount)}
            </p>
            {transaction.category && (
              <CategoryBadge category={transaction.category} className="mt-1" />
            )}
          </div>
        </div>
      ))}
      
      <a 
        href="/transactions" 
        className={cn(
          buttonVariants({ variant: "link" }),
          "w-full justify-center mt-2 p-0 h-auto"
        )}
        onClick={(e) => {
          e.preventDefault();
          navigate('/transactions');
        }}
      >
        View all transactions
      </a>
    </div>
  );
};
