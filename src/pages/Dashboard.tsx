
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { AccountsSummary } from '@/components/AccountsSummary';
import { CashFlowChart } from '@/components/CashFlowChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { financeSummary, dummyTransactions } from '@/lib/dummyData';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState<"month" | "quarter" | "year">("month");
  const [businessView, setBusinessView] = useState('all');
  
  // Filter transactions based on business view
  const filteredTransactions = dummyTransactions.filter(transaction => {
    if (businessView === 'all') return true;
    return transaction.category === businessView;
  });
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Financial Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Your financial overview and insights
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={timeFrame} onValueChange={(value: "month" | "quarter" | "year") => setTimeFrame(value)}>
              <SelectTrigger className="w-[130px] card-hover">
                <SelectValue placeholder="Time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={businessView} onValueChange={setBusinessView} className="border rounded-md">
              <TabsList className="bg-transparent p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vivid-purple data-[state=active]:to-ocean-blue data-[state=active]:text-white rounded-md">
                  All
                </TabsTrigger>
                <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-bright-orange data-[state=active]:to-red-500 data-[state=active]:text-white rounded-md">
                  Personal
                </TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean-blue data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md">
                  Business
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="icon" className="card-hover">
              <Calendar className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" className="card-hover">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="flex items-center gap-1 card-hover">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <AccountsSummary />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2 glass-card card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Cash Flow</CardTitle>
              <Badge variant={businessView === 'all' ? 'default' : businessView === 'business' ? 'secondary' : 'outline'} className={`${
                businessView === 'business' ? 'bg-ocean-blue' : 
                businessView === 'personal' ? 'bg-bright-orange' : ''
              }`}>
                {businessView === 'all' ? 'All Accounts' : businessView === 'business' ? 'Business' : 'Personal'}
              </Badge>
            </CardHeader>
            <CardContent>
              <CashFlowChart data={financeSummary.monthlySummary} timeFrame={timeFrame} />
            </CardContent>
          </Card>
          
          <Card className="glass-card card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
              <Button variant="link" size="sm" className="text-primary p-0" onClick={() => window.location.href = '/transactions'}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <RecentTransactions transactions={filteredTransactions.slice(0, 5)} />
            </CardContent>
          </Card>
        </div>
        
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
      </div>
    </MainLayout>
  );
};

export default Dashboard;
