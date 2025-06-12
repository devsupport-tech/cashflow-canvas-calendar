
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashFlowChart } from '@/components/CashFlowChart';
import { MonthlyTotal } from '@/lib/types';

interface CashFlowSectionProps {
  businessView: string;
  monthlySummary: MonthlyTotal[];
  timeFrame: "day" | "week" | "month" | "quarter" | "year";
}

export const CashFlowSection: React.FC<CashFlowSectionProps> = ({
  businessView,
  monthlySummary,
  timeFrame
}) => {
  return (
    <Card className="md:col-span-2 glass-card card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Cash Flow</CardTitle>
        <Badge variant={businessView === 'all' ? 'default' : businessView === 'business' ? 'secondary' : 'outline'} className={`${
          businessView === 'business' ? 'bg-ocean-blue text-white' : 
          businessView === 'personal' ? 'bg-bright-orange text-white' : ''
        }`}>
          {businessView === 'all' ? 'All Accounts' : businessView === 'business' ? 'Business' : 'Personal'}
        </Badge>
      </CardHeader>
      <CardContent>
        {(!monthlySummary || monthlySummary.length === 0 || monthlySummary.every(m => m.income === 0 && m.expenses.personal === 0 && m.expenses.business === 0)) ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <img src="/assets/dashboard-empty.svg" alt="No cash flow" className="w-20 h-20 mb-3 opacity-80" aria-hidden="true" />
            <div className="font-semibold text-base mb-1">No cash flow data</div>
            <div className="text-muted-foreground mb-2">Add transactions to see your cash flow over time.</div>
            <a href="/transactions" tabIndex={0} className="underline text-primary">Go to Transactions</a>
          </div>
        ) : (
          <CashFlowChart data={monthlySummary} timeFrame={timeFrame} />
        )}
      </CardContent>
    </Card>
  );
};
