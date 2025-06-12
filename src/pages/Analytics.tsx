
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useTransactionData } from '@/hooks/useTransactionData';
import { useMemo } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { FinanceSummary, MonthlyTotal, CategoryTotal } from '@/lib/types';

const Analytics = () => {
  const { transactions, isLoading, error } = useTransactionData();

  // Compute finance summary from live transactions (same as Dashboard)
  const financeSummary: FinanceSummary = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        personalExpenses: 0,
        businessExpenses: 0,
        monthlySummary: [],
        categoryTotals: { personal: [], business: [] }
      };
    }

    // Group by month for the last 12 months
    const now = new Date();
    const months: Date[] = [];
    for (let i = 11; i >= 0; i--) {
      months.push(startOfMonth(new Date(now.getFullYear(), now.getMonth() - i, 1)));
    }
    const monthlySummary: MonthlyTotal[] = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthTx = transactions.filter(t => isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd }));
      const income = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
      const expensesPersonal = monthTx.filter(t => t.type === 'expense' && t.category === 'personal').reduce((sum, t) => sum + Number(t.amount), 0);
      const expensesBusiness = monthTx.filter(t => t.type === 'expense' && t.category === 'business').reduce((sum, t) => sum + Number(t.amount), 0);
      const total = income + expensesPersonal + expensesBusiness;
      return {
        month: monthStart,
        income,
        expenses: { personal: expensesPersonal, business: expensesBusiness },
        total
      };
    });

    // Totals
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const personalExpenses = transactions.filter(t => t.type === 'expense' && t.category === 'personal').reduce((sum, t) => sum + Number(t.amount), 0);
    const businessExpenses = transactions.filter(t => t.type === 'expense' && t.category === 'business').reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = personalExpenses + businessExpenses;

    // Category totals (personal/business)
    const getCategoryTotals = (category: string): CategoryTotal[] => {
      const expenses = transactions.filter(t => t.type === 'expense' && t.category === category);
      const totalAmount = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
      const expenseTypeMap = new Map<string, number>();
      expenses.forEach(expense => {
        if (expense.expenseType) {
          const current = expenseTypeMap.get(expense.expenseType) || 0;
          expenseTypeMap.set(expense.expenseType, current + Number(expense.amount));
        }
      });
      return Array.from(expenseTypeMap.entries()).map(([cat, amount]) => ({
        category: (cat as import('@/lib/types').ExpenseType) || 'other',
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      })).sort((a, b) => b.amount - a.amount);
    };

    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      personalExpenses,
      businessExpenses,
      monthlySummary,
      categoryTotals: {
        personal: getCategoryTotals('personal'),
        business: getCategoryTotals('business')
      }
    };
  }, [transactions]);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Financial insights and trends
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-2 py-8">
            {[1,2,3].map(i => (
              <div key={i} className="animate-fade-in">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted to-secondary/80 rounded-lg animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-muted-foreground/20" />
                    <div className="h-3 w-1/4 rounded bg-muted-foreground/10" />
                  </div>
                  <div className="h-6 w-12 rounded bg-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-destructive animate-fade-in">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-2 animate-bounce">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <div>Failed to load analytics data.</div>
            <button className="mt-2 underline" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : financeSummary.totalIncome === 0 && financeSummary.totalExpenses === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <img src="/assets/analytics-empty.svg" alt="No analytics data" className="w-24 h-24 mb-4 opacity-80" aria-hidden="true" />
            <div className="font-semibold text-lg mb-2">No analytics data yet</div>
            <div className="text-muted-foreground mb-4">Add transactions to see your financial insights and trends!</div>
            <a href="/transactions" tabIndex={0} className="underline text-primary">Go to Transactions</a>
          </div>
        ) : (
          <AnalyticsDashboard summary={financeSummary} />
        )}
      </div>
    </MainLayout>
  );
};

export default Analytics;
