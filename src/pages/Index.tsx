
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { ExpenseCalendar } from '@/components/ExpenseCalendar';
import { BalanceCard } from '@/components/ui/BalanceCard';
import { dummyTransactions, financeSummary } from '@/lib/dummyData';
import { CalendarClock, TrendingUp, Wallet } from 'lucide-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';

const Index = () => {
  const { currentWorkspace } = useWorkspace();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expense Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Track and visualize your expenses
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <BalanceCard
            title="Month Balance"
            amount={financeSummary.monthlySummary[5].total}
            icon={<Wallet className="h-5 w-5 text-primary" />}
            showSign
          />
          <BalanceCard
            title="Month Income"
            amount={financeSummary.monthlySummary[5].income}
            icon={<TrendingUp className="h-5 w-5 text-income" />}
          />
          <BalanceCard
            title="Month Expenses"
            amount={financeSummary.monthlySummary[5].expenses.personal + financeSummary.monthlySummary[5].expenses.business}
            icon={<CalendarClock className="h-5 w-5 text-destructive" />}
          />
        </div>
        
        <ExpenseCalendar 
          transactions={dummyTransactions} 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewType="month"
          workspaceFilter={currentWorkspace}
        />
      </div>
    </MainLayout>
  );
};

export default Index;
