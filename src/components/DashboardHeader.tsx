
import React from 'react';
import { DashboardFilters } from './DashboardFilters';

interface DashboardHeaderProps {
  timeFrame: "day" | "week" | "month" | "quarter" | "year";
  setTimeFrame: (value: "day" | "week" | "month" | "quarter" | "year") => void;
  businessView: string;
  setBusinessView: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeFrame,
  setTimeFrame,
  businessView,
  setBusinessView,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Financial Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your financial overview and insights
        </p>
      </div>
      
      <DashboardFilters 
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        businessView={businessView}
        setBusinessView={setBusinessView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
};
