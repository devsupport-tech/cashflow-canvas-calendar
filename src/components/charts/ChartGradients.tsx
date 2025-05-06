
import React from 'react';

interface ChartGradientsProps {
  themeColors: {
    income: string;
    personalExpense: string;
    businessExpense: string;
    future: string;
  };
}

export const ChartGradients: React.FC<ChartGradientsProps> = ({ themeColors }) => {
  return (
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
      <pattern id="patternFuture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke={themeColors.future} strokeWidth="1"/>
      </pattern>
    </defs>
  );
};
