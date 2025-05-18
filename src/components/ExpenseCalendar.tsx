import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, isSameMonth, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Transaction } from '@/lib/types';

interface ExpenseCalendarProps {
  transactions: Transaction[];
  selectedDate?: Date;
  setSelectedDate?: (date: Date) => void;
  viewType?: 'day' | 'week' | 'month';
  workspaceFilter?: string; // Changed from 'all' | 'personal' | 'business' to string
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

// Helper function for comparing view types safely
const isViewType = (view: string, targetType: string): boolean => {
  return view === targetType;
};

// Component implementation
export const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({
  transactions,
  selectedDate,
  setSelectedDate,
  viewType = 'month',
  workspaceFilter = 'all',
  timeRange = 'month'
}) => {
  const [open, setOpen] = useState(false);
  const [internalDate, setInternalDate] = useState<Date>(selectedDate || new Date());
  
  // Use either the provided setSelectedDate function or our internal state
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      if (setSelectedDate) {
        setSelectedDate(date);
      } else {
        setInternalDate(date);
      }
    }
  };
  
  // Use either the provided selectedDate or our internal state
  const currentDate = selectedDate || internalDate;

  const filteredTransactions = transactions.filter(transaction => {
    // Time range filter based on the timeRange prop
    const txDate = new Date(transaction.date);
    
    if (timeRange === 'day') {
      return isSameDay(txDate, currentDate);
    } 
    else if (timeRange === 'week') {
      const startOfWeekDate = startOfWeek(currentDate);
      const endOfWeekDate = endOfWeek(currentDate);
      return txDate >= startOfWeekDate && txDate <= endOfWeekDate;
    }
    else if (timeRange === 'month') {
      const startOfMonthDate = startOfMonth(currentDate);
      const endOfMonthDate = endOfMonth(currentDate);
      return txDate >= startOfMonthDate && txDate <= endOfMonthDate;
    }
    else if (timeRange === 'quarter') {
      const startOfQuarterDate = startOfQuarter(currentDate);
      const endOfQuarterDate = endOfQuarter(currentDate);
      return txDate >= startOfQuarterDate && txDate <= endOfQuarterDate;
    }
    else if (timeRange === 'year') {
      const startOfYearDate = startOfYear(currentDate);
      const endOfYearDate = endOfYear(currentDate);
      return txDate >= startOfYearDate && txDate <= endOfYearDate;
    }
    
    // Workspace filter
    if (workspaceFilter !== 'all' && transaction.category !== workspaceFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="border rounded-md p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !currentDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate ? (
              format(currentDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" side="bottom">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateChange}
            disabled={(date) =>
              date > addDays(new Date(), 0)
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <h3 className="text-lg font-semibold mt-4">
        Transactions for {timeRange === 'day' ? format(currentDate, "PPP") :
                          timeRange === 'week' ? `Week of ${format(startOfWeek(currentDate), "PPP")}` :
                          timeRange === 'month' ? format(currentDate, "MMMM yyyy") :
                          timeRange === 'quarter' ? `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}` :
                          `Year ${currentDate.getFullYear()}`}
      </h3>
      {filteredTransactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions for this {timeRange}.</p>
      ) : (
        <ul>
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id} className="py-2 border-b">
              {transaction.description} - ${transaction.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
