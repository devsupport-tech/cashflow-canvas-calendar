
import React, { useState } from 'react';
import { AccountsSummary } from '@/components/AccountsSummary';
import { financeSummary, dummyTransactions } from '@/lib/dummyData';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CashFlowSection } from '@/components/CashFlowSection';
import { RecentTransactionsSection } from '@/components/RecentTransactionsSection';
import { DashboardTabs } from '@/components/DashboardTabs';

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
  const [businessView, setBusinessView] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Filter transactions based on business view
  const filteredTransactions = dummyTransactions.filter(transaction => {
    if (businessView === 'all') return true;
    return transaction.category === businessView;
  });
  
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
        <CashFlowSection 
          businessView={businessView}
          monthlySummary={financeSummary.monthlySummary}
          timeFrame={timeFrame}
        />
        
        <RecentTransactionsSection transactions={filteredTransactions} />
      </div>
      
      <DashboardTabs financeSummary={financeSummary} />
    </>
  );
};

export default Dashboard;
