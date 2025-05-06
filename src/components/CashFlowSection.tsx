
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
        <CashFlowChart data={monthlySummary} timeFrame={timeFrame} />
      </CardContent>
    </Card>
  );
};
