
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
  ReferenceLine,
} from 'recharts';
import { useColorTheme } from '@/contexts/ColorThemeContext';
import { MonthlyTotal } from '@/lib/types';
import { ChartGradients } from './charts/ChartGradients';
import { ChartStyles } from './charts/ChartStyles';
import { formatYAxis, getFormattedChartData, getThemeColors } from './charts/ChartUtils';

interface CashFlowChartProps {
  data: MonthlyTotal[];
  timeFrame: "day" | "week" | "month" | "quarter" | "year";
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, timeFrame }) => {
  const { colorAccent } = useColorTheme();
  
  const formattedData = getFormattedChartData(data, timeFrame);
  
  // Find the index where future data starts
  const todayIndex = formattedData.findIndex(item => item.isFuture);
  
  // Get colors based on the theme
  const themeColors = getThemeColors(colorAccent);
  
  return (
    <div className="h-[300px] w-full">
      <ChartStyles />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <ChartGradients themeColors={themeColors} />
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
          {todayIndex > 0 && (
            <ReferenceLine 
              x={formattedData[todayIndex].name} 
              stroke={themeColors.future} 
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{ 
                value: 'Now', 
                position: 'top', 
                fill: themeColors.future,
                fontSize: 12 
              }} 
            />
          )}
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            labelFormatter={(label, items) => {
              const dataItem = formattedData.find(item => item.name === label);
              return `${label}${dataItem?.isFuture ? ' (Projected)' : ''}`;
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
