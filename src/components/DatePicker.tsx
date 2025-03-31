
import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useColorTheme } from "@/contexts/ColorThemeContext";
import { DayProps } from "react-day-picker";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  showFutureDates?: boolean;
  highlightDates?: Date[];
}

export function DatePicker({
  date,
  setDate,
  className,
  showFutureDates = true,
  highlightDates = [],
}: DatePickerProps) {
  const { colorAccent } = useColorTheme();
  
  // Convert highlight dates to ISO strings for comparison
  const highlightDatesISO = highlightDates.map(d => d.toISOString().split('T')[0]);
  
  // Custom day rendering to highlight dates with transactions
  const dayRenderer = (props: DayProps) => {
    const { date: day, ...dayProps } = props;
    const isHighlighted = highlightDatesISO.includes(day.toISOString().split('T')[0]);
    
    return (
      <div
        {...dayProps}
        className={cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          isHighlighted && "relative",
          isHighlighted && "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full",
          isHighlighted && colorAccent === 'vivid-purple' && "after:bg-purple-500",
          isHighlighted && colorAccent === 'ocean-blue' && "after:bg-blue-500",
          isHighlighted && colorAccent === 'bright-orange' && "after:bg-orange-500",
          !isHighlighted && "after:bg-transparent"
        )}
      >
        {day.getDate()}
      </div>
    );
  };
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
        disabled={!showFutureDates ? { after: new Date() } : undefined}
        components={{
          Day: dayRenderer
        }}
        className={cn("p-3 pointer-events-auto", 
          colorAccent === 'vivid-purple' && "theme-vivid-purple",
          colorAccent === 'ocean-blue' && "theme-ocean-blue",
          colorAccent === 'bright-orange' && "theme-bright-orange"
        )}
      />
    </div>
  );
}
