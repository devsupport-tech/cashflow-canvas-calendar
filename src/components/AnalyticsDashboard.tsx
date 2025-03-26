
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinanceSummary, CategoryTotal } from '@/lib/types';
import { BalanceCard } from './ui/BalanceCard';
import { CategoryDot } from './CategoryBadge';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalyticsDashboardProps {
  summary: FinanceSummary;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ summary }) => {
  const isMobile = useIsMobile();
  
  // Format monthly data for chart
  const monthlyData = summary.monthlySummary.map(month => ({
    name: format(month.month, 'MMM'),
    personal: month.expenses.personal,
    business: month.expenses.business,
    income: month.income
  }));
  
  // Format category data for pie charts
  const formatCategoryData = (categories: CategoryTotal[]) => {
    return categories.map(cat => ({
      name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
      value: cat.amount
    }));
  };
  
  const personalCategoriesData = formatCategoryData(summary.categoryTotals.personal);
  const businessCategoriesData = formatCategoryData(summary.categoryTotals.business);
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border shadow-md rounded-md p-3">
          <p className="mb-2 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const PieChartWithCategories: React.FC<{ data: any[], title: string }> = ({ data, title }) => (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => {
                if (typeof value === 'number') {
                  return `$${value.toFixed(2)}`;
                }
                return `$${value}`;
              }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BalanceCard
          title="Total Balance"
          amount={summary.netAmount}
          icon={<Wallet className="h-5 w-5 text-primary" />}
          trend={{
            value: 12.5,
            isPositive: summary.netAmount > 0
          }}
        />
        <BalanceCard
          title="Income"
          amount={summary.totalIncome}
          icon={<TrendingUp className="h-5 w-5 text-income" />}
          showSign
        />
        <BalanceCard
          title="Expenses"
          amount={summary.totalExpenses}
          icon={<TrendingDown className="h-5 w-5 text-destructive" />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: isMobile ? 0 : 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} width={isMobile ? 35 : 60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="personal" name="Personal" fill="hsl(var(--expense-personal))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="business" name="Business" fill="hsl(var(--expense-business))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="font-medium text-lg mb-4">Expense Breakdown</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <CategoryDot category="personal" />
            <span className="text-sm">Personal: ${summary.personalExpenses.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CategoryDot category="business" />
            <span className="text-sm">Business: ${summary.businessExpenses.toFixed(2)}</span>
          </div>
        </div>
        
        <Tabs defaultValue="personal">
          <TabsList className="w-full">
            <TabsTrigger value="personal" className="flex-1">Personal Expenses</TabsTrigger>
            <TabsTrigger value="business" className="flex-1">Business Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="pt-4">
            <div className="grid grid-cols-1 gap-6">
              <PieChartWithCategories 
                data={personalCategoriesData} 
                title="Personal Expenses by Category" 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="business" className="pt-4">
            <div className="grid grid-cols-1 gap-6">
              <PieChartWithCategories 
                data={businessCategoriesData} 
                title="Business Expenses by Category" 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
