
import { format, isFuture, isToday } from 'date-fns';
import { MonthlyTotal } from '@/lib/types';

export const formatYAxis = (value: number) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export const getFormattedChartData = (data: MonthlyTotal[], timeFrame: "day" | "week" | "month" | "quarter" | "year") => {
  if (timeFrame === 'day') {
    // Return hourly data for a day
    return data.slice(0, 24).map((point, index) => ({
      ...point,
      name: `${index}:00`,
      isFuture: index > new Date().getHours()
    }));
  } else if (timeFrame === 'week') {
    // Return daily data for a week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return data.slice(0, 7).map((point, index) => ({
      ...point,
      name: days[index],
      isFuture: index >= new Date().getDay()
    }));
  } else {
    // For month, quarter, year - format the month date
    return data.map(point => ({
      ...point,
      name: format(point.month, 'MMM'),
      isFuture: isFuture(point.month) || isToday(point.month)
    }));
  }
};

export const getThemeColors = (colorAccent: string) => {
  switch(colorAccent) {
    case 'vivid-purple':
      return {
        income: '#9333EA',
        personalExpense: '#FF8A65',
        businessExpense: '#7C3AED',
        future: '#E9D5FF'
      };
    case 'ocean-blue':
      return {
        income: '#06B6D4',
        personalExpense: '#FF8A65',
        businessExpense: '#0284C7',
        future: '#BAE6FD'
      };
    case 'bright-orange':
      return {
        income: '#F97316',
        personalExpense: '#EA580C',
        businessExpense: '#0284C7',
        future: '#FFEDD5'
      };
    default:
      return {
        income: 'var(--income)',
        personalExpense: 'var(--expense-personal)',
        businessExpense: 'var(--expense-business)',
        future: 'var(--accent)'
      };
  }
};
