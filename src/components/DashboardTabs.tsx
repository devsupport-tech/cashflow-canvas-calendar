
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FinanceSummary } from '@/lib/types';

interface DashboardTabsProps {
  financeSummary: FinanceSummary;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  financeSummary
}) => {
  return (
    <Tabs defaultValue="overview" className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <TabsList>
        <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vivid-purple data-[state=active]:to-ocean-blue data-[state=active]:text-white">Overview</TabsTrigger>
        <TabsTrigger value="income" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white">Income</TabsTrigger>
        <TabsTrigger value="expenses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-bright-orange data-[state=active]:to-red-500 data-[state=active]:text-white">Expenses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsDashboard summary={financeSummary} />
        </div>
      </TabsContent>
      
      <TabsContent value="income" className="mt-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Income Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Income breakdown coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="expenses" className="mt-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Expense Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Detailed expense breakdown coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
