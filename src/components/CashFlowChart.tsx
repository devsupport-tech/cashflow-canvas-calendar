
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useColorTheme } from '@/contexts/ColorThemeContext';

interface DataPoint {
  name: string;
  income: number;
  expenses: {
    personal: number;
    business: number;
  };
  total: number;
}

interface CashFlowChartProps {
  data: DataPoint[];
  timeFrame: "day" | "week" | "month" | "quarter" | "year";
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, timeFrame }) => {
  const { colorAccent } = useColorTheme();
  
  // Format the data based on the timeFrame
  const getFormattedData = () => {
    // For demonstration, we'll use the existing data but format it differently
    // In a real app, you would fetch different data based on the timeFrame
    
    if (timeFrame === 'day') {
      // Return hourly data for a day
      return data.slice(0, 24).map((point, index) => ({
        ...point,
        name: `${index}:00`,
      }));
    } else if (timeFrame === 'week') {
      // Return daily data for a week
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return data.slice(0, 7).map((point, index) => ({
        ...point,
        name: days[index],
      }));
    } else {
      // Return the original monthly data
      return data;
    }
  };
  
  const formattedData = getFormattedData();
  
  // Get colors based on the theme
  const getThemeColors = () => {
    switch(colorAccent) {
      case 'vivid-purple':
        return {
          income: '#9333EA',
          personalExpense: '#FF8A65',
          businessExpense: '#7C3AED'
        };
      case 'ocean-blue':
        return {
          income: '#06B6D4',
          personalExpense: '#FF8A65',
          businessExpense: '#0284C7'
        };
      case 'bright-orange':
        return {
          income: '#F97316',
          personalExpense: '#EA580C',
          businessExpense: '#0284C7'
        };
      default:
        return {
          income: 'var(--income)',
          personalExpense: 'var(--expense-personal)',
          businessExpense: 'var(--expense-business)'
        };
    }
  };
  
  const themeColors = getThemeColors();
  
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.income} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={themeColors.income} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPersonalExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.personalExpense} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={themeColors.personalExpense} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBusinessExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.businessExpense} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={themeColors.businessExpense} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 0.5 }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 0.5 }}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="income" 
            name="Income"
            stroke={themeColors.income} 
            fillOpacity={1} 
            fill="url(#colorIncome)" 
          />
          <Area 
            type="monotone" 
            dataKey="expenses.personal" 
            name="Personal Expenses"
            stroke={themeColors.personalExpense} 
            fillOpacity={1} 
            fill="url(#colorPersonalExpense)" 
          />
          <Area 
            type="monotone" 
            dataKey="expenses.business" 
            name="Business Expenses"
            stroke={themeColors.businessExpense} 
            fillOpacity={1} 
            fill="url(#colorBusinessExpense)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
