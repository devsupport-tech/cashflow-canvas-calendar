
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
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/types';
import { ExpenseForm } from './ExpenseForm';
import { CategoryDot } from './CategoryBadge';

interface ExpenseCalendarProps {
  transactions: Transaction[];
}

export const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({ transactions }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between py-4">
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
        <h2 className="text-xl font-semibold">
          {format(currentMonth, dateFormat)}
        </h2>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <ExpenseForm onClose={() => setFormOpen(false)} />
        </Dialog>
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
        const dayTransactions = transactions.filter(
          (transaction) => 
            transaction.type === 'expense' && 
            isSameDay(transaction.date, day)
        );

        const personalExpenses = dayTransactions.filter(t => t.category === 'personal');
        const businessExpenses = dayTransactions.filter(t => t.category === 'business');
        
        const totalPersonal = personalExpenses.reduce((sum, t) => sum + t.amount, 0);
        const totalBusiness = businessExpenses.reduce((sum, t) => sum + t.amount, 0);

        const dayClasses = cn(
          "calendar-day",
          !isSameMonth(day, monthStart) && "outside-month",
          isToday(day) && "today"
        );

        days.push(
          <div 
            className={dayClasses}
            key={day.toString()}
          >
            <div className="calendar-day-header">
              {format(day, "d")}
            </div>
            <div className="calendar-day-content">
              {totalPersonal > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <CategoryDot category="personal" />
                  <span>${totalPersonal.toFixed(0)}</span>
                </div>
              )}
              {totalBusiness > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <CategoryDot category="business" />
                  <span>${totalBusiness.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-8">{rows}</div>;
  };

  return (
    <div className="animate-in fade-in">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
