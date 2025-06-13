
import React, { useState } from 'react';
import { AccountsSummary } from '@/components/AccountsSummary';
import { useTransactionData } from '@/hooks/useTransactionData';
import { MonthlyTotal } from '@/lib/types';
import { startOfMonth, endOfMonth } from 'date-fns';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CashFlowSection } from '@/components/CashFlowSection';
import { RecentTransactionsSection } from '@/components/RecentTransactionsSection';
import { DashboardTabs } from '@/components/DashboardTabs';

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
  const [businessView, setBusinessView] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
    // Use live transactions from backend
  const { transactions, isLoading, error } = useTransactionData();

  // Filter transactions based on business view
  const filteredTransactions = transactions.filter(transaction => {
    if (businessView === 'all') return true;
    return transaction.category === businessView;
  });

  // Compute monthlySummary for CashFlowSection
  const computeMonthlySummary = (txs: typeof transactions): MonthlyTotal[] => {
    // Group by month (last 12 months)
    const now = new Date();
    const summary: MonthlyTotal[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - i));
      const monthEnd = endOfMonth(monthStart);
      const monthTxs = txs.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= monthStart && txDate <= monthEnd &&
          (businessView === 'all' || tx.category === businessView);
      });
      const income = monthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const personal = monthTxs.filter(t => t.type === 'expense' && t.category === 'personal').reduce((sum, t) => sum + t.amount, 0);
      const business = monthTxs.filter(t => t.type === 'expense' && t.category === 'business').reduce((sum, t) => sum + t.amount, 0);
      summary.push({
        month: monthStart,
        income,
        expenses: { personal, business },
        total: income - (personal + business),
      });
    }
    return summary;
  };
  const monthlySummary = computeMonthlySummary(transactions);

  // Compute live finance summary for DashboardTabs
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const personalExpenses = transactions.filter(t => t.type === 'expense' && t.category === 'personal').reduce((sum, t) => sum + t.amount, 0);
  const businessExpenses = transactions.filter(t => t.type === 'expense' && t.category === 'business').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = personalExpenses + businessExpenses;
  const netAmount = totalIncome - totalExpenses;

  // Category totals (personal and business)
  const getCategoryTotals = (txs: typeof transactions, categoryType: 'personal' | 'business') => {
    const expenseTxs = txs.filter(t => t.type === 'expense' && t.category === categoryType);
    const total = expenseTxs.reduce((sum, t) => sum + t.amount, 0);
    const grouped: Record<string, number> = {};
    expenseTxs.forEach(t => {
      if (!t.expenseType) return;
      grouped[t.expenseType] = (grouped[t.expenseType] || 0) + t.amount;
    });
    return Object.entries(grouped).map(([expenseType, amount]) => ({
      category: expenseType as import('@/lib/types').ExpenseType,
      amount,
      percentage: total ? (amount / total) * 100 : 0,
    }));
  };
  const categoryTotals = {
    personal: getCategoryTotals(transactions, 'personal'),
    business: getCategoryTotals(transactions, 'business'),
  };

  const financeSummary = {
    totalIncome,
    totalExpenses,
    netAmount,
    personalExpenses,
    businessExpenses,
    monthlySummary,
    categoryTotals,
  };
  
  return (
    <>
      <DashboardHeader
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        businessView={businessView}
        setBusinessView={setBusinessView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <AccountsSummary />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          <div className="p-4 text-muted-foreground">Loading cash flow...</div>
        ) : error ? (
          <div className="p-4 text-destructive">Failed to load cash flow data.</div>
        ) : (
          <CashFlowSection 
            businessView={businessView}
            monthlySummary={monthlySummary}
            timeFrame={timeFrame}
          />
        )}
        {isLoading ? (
          <div className="p-4 text-muted-foreground">Loading recent transactions...</div>
        ) : error ? (
          <div className="p-4 text-destructive">Failed to load recent transactions.</div>
        ) : (
          <RecentTransactionsSection transactions={filteredTransactions.slice(0, 5)} />
        )}
      </div>
      
      {isLoading ? (
        <div className="p-4 text-muted-foreground">Loading dashboard summary...</div>
      ) : error ? (
        <div className="p-4 text-destructive">Failed to load dashboard summary.</div>
      ) : (
        <DashboardTabs financeSummary={financeSummary} />
      )}
    </>
  );
};

export default Dashboard;
