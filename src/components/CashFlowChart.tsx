
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import { MonthlyTotal } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, subMonths, startOfQuarter, endOfQuarter, subQuarters, getYear, subYears } from 'date-fns';

interface CashFlowChartProps {
  data: MonthlyTotal[];
  timeFrame: 'month' | 'quarter' | 'year';
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, timeFrame }) => {
  const isMobile = useIsMobile();
  
  // Process data based on timeFrame
  const processedData = React.useMemo(() => {
    if (timeFrame === 'month') {
      // Use monthly data as is
      return data.slice(-6).map(month => ({
        name: format(month.month, 'MMM'),
        income: month.income,
        expenses: month.expenses.personal + month.expenses.business,
        balance: month.total
      }));
    } else if (timeFrame === 'quarter') {
      // Group by quarter
      const quarterData: Record<string, { income: number; expenses: number; balance: number }> = {};
      
      data.forEach(month => {
        const quarterKey = `${getYear(month.month)}-Q${Math.floor(month.month.getMonth() / 3) + 1}`;
        
        if (!quarterData[quarterKey]) {
          quarterData[quarterKey] = { income: 0, expenses: 0, balance: 0 };
        }
        
        quarterData[quarterKey].income += month.income;
        quarterData[quarterKey].expenses += month.expenses.personal + month.expenses.business;
        quarterData[quarterKey].balance += month.total;
      });
      
      return Object.entries(quarterData).slice(-4).map(([key, value]) => ({
        name: key.split('-')[1],
        income: value.income,
        expenses: value.expenses,
        balance: value.balance
      }));
    } else {
      // Group by year
      const yearData: Record<string, { income: number; expenses: number; balance: number }> = {};
      
      data.forEach(month => {
        const yearKey = `${getYear(month.month)}`;
        
        if (!yearData[yearKey]) {
          yearData[yearKey] = { income: 0, expenses: 0, balance: 0 };
        }
        
        yearData[yearKey].income += month.income;
        yearData[yearKey].expenses += month.expenses.personal + month.expenses.business;
        yearData[yearKey].balance += month.total;
      });
      
      return Object.entries(yearData).slice(-3).map(([key, value]) => ({
        name: key,
        income: value.income,
        expenses: value.expenses,
        balance: value.balance
      }));
    }
  }, [data, timeFrame]);
  
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: isMobile ? 0 : 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value > 999 ? `${(value / 1000).toFixed(1)}k` : value}`} />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend />
          <Bar dataKey="income" name="Income" fill="hsl(var(--income))" barSize={20} />
          <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" barSize={20} />
          <Line type="monotone" dataKey="balance" name="Net" stroke="hsl(var(--primary))" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
