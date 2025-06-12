
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecentTransactions } from '@/components/RecentTransactions';
import { Transaction } from '@/lib/types';

interface RecentTransactionsSectionProps {
  transactions: Transaction[];
}

export const RecentTransactionsSection: React.FC<RecentTransactionsSectionProps> = ({
  transactions
}) => {
  return (
    <Card className="glass-card card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
        <Button variant="link" size="sm" className="text-primary p-0" onClick={() => window.location.href = '/transactions'}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {(!transactions || transactions.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <img src="/assets/dashboard-empty.svg" alt="No recent transactions" className="w-20 h-20 mb-3 opacity-80" aria-hidden="true" />
            <div className="font-semibold text-base mb-1">No recent transactions</div>
            <div className="text-muted-foreground mb-2">Add transactions to see your recent activity.</div>
            <a href="/transactions" tabIndex={0} className="underline text-primary">Go to Transactions</a>
          </div>
        ) : (
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        )}
      </CardContent>
    </Card>
  );
};
