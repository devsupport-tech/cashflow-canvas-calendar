
import React, { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  format, 
  addDays, 
  isSameMonth, 
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  isFuture,
  isPast
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/types';
import { ExpenseForm } from './ExpenseForm';
import { CategoryDot } from './CategoryBadge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExpenseCalendarProps {
  transactions: Transaction[];
}

export const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({ transactions }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'past' | 'upcoming'>('all');

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Filter transactions based on view mode
  const filteredTransactions = transactions.filter(transaction => {
    if (viewMode === 'past') {
      return isPast(transaction.date);
    } else if (viewMode === 'upcoming') {
      return isFuture(transaction.date);
    }
    return true;
  });

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevMonth}
              className="transition-transform duration-200 hover:-translate-x-0.5"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextMonth}
              className="transition-transform duration-200 hover:translate-x-0.5"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold whitespace-nowrap">
            {format(currentMonth, dateFormat)}
          </h2>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Select 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'all' | 'past' | 'upcoming')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="past">Past Transactions</SelectItem>
              <SelectItem value="upcoming">Upcoming Transactions</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <ExpenseForm 
              onClose={() => setFormOpen(false)} 
              initialDate={selectedDate || undefined}
            />
          </Dialog>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-sm font-medium text-center">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayTransactions = filteredTransactions.filter(
          (transaction) => isSameDay(transaction.date, day)
        );

        const personalExpenses = dayTransactions.filter(t => t.category === 'personal' && t.type === 'expense');
        const businessExpenses = dayTransactions.filter(t => t.category === 'business' && t.type === 'expense');
        const incomeTransactions = dayTransactions.filter(t => t.type === 'income');
        
        const totalPersonal = personalExpenses.reduce((sum, t) => sum + t.amount, 0);
        const totalBusiness = businessExpenses.reduce((sum, t) => sum + t.amount, 0);
        const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

        const isUpcoming = isFuture(day);
        
        const dayClasses = cn(
          "calendar-day p-1 min-h-[80px] border border-border",
          !isSameMonth(day, monthStart) && "outside-month text-muted-foreground bg-muted/30",
          isToday(day) && "today ring-1 ring-primary",
          isUpcoming && "bg-muted/10",
          "hover:bg-accent/50 cursor-pointer transition-colors"
        );

        days.push(
          <div 
            className={dayClasses}
            key={day.toString()}
            onClick={() => {
              setSelectedDate(day);
              setFormOpen(true);
            }}
          >
            <div className="calendar-day-header flex justify-between items-center">
              <span className={cn(
                "text-sm font-medium",
                isUpcoming && "text-primary"
              )}>
                {format(day, "d")}
              </span>
              {isUpcoming && <CalendarIcon className="h-3 w-3 text-muted-foreground" />}
            </div>
            <div className="calendar-day-content mt-1 space-y-1">
              {totalIncome > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="h-2 w-2 rounded-full bg-income"></div>
                  <span className="text-income">+${totalIncome.toFixed(0)}</span>
                </div>
              )}
              {totalPersonal > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <CategoryDot category="personal" />
                  <span className="text-destructive">-${totalPersonal.toFixed(0)}</span>
                </div>
              )}
              {totalBusiness > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <CategoryDot category="business" />
                  <span className="text-destructive">-${totalBusiness.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-[1px]">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-8 space-y-[1px]">{rows}</div>;
  };

  return (
    <div className="animate-in fade-in">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
