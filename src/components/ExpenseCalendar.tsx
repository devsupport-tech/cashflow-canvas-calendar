import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Transaction } from '@/lib/types';

interface ExpenseCalendarProps {
  transactions: Transaction[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  viewType: 'day' | 'week' | 'month';
  workspaceFilter: 'all' | 'personal' | 'business';
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
  viewType,
  workspaceFilter
}) => {
  const [open, setOpen] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    // View type filter
    if (isViewType(viewType, 'day') && !isSameDay(new Date(transaction.date), selectedDate)) {
      return false;
    }
    
    if (isViewType(viewType, 'week')) {
      const startOfWeekDate = startOfWeek(selectedDate);
      const endOfWeekDate = endOfWeek(selectedDate);
      const transactionDate = new Date(transaction.date);
      
      if (!(transactionDate >= startOfWeekDate && transactionDate <= endOfWeekDate)) {
        return false;
      }
    }
    
    if (isViewType(viewType, 'month')) {
      if (!isSameMonth(new Date(transaction.date), selectedDate)) {
        return false;
      }
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
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" side="bottom">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              date > addDays(new Date(), 0)
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <h3 className="text-lg font-semibold mt-4">Transactions for {format(selectedDate, "PPP")}</h3>
      {filteredTransactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions for this date.</p>
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
