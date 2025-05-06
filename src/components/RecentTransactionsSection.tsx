
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
        <RecentTransactions transactions={transactions.slice(0, 5)} />
      </CardContent>
    </Card>
  );
};
