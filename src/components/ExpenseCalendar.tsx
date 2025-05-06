
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
  isPast,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay
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
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface ExpenseCalendarProps {
  transactions: Transaction[];
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({ 
  transactions, 
  timeRange = 'month' 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'past' | 'upcoming'>('all');
  const { currentWorkspace } = useWorkspace();

  const nextPeriod = () => {
    switch (timeRange) {
      case 'day':
        setCurrentMonth(addDays(currentMonth, 1));
        break;
      case 'week':
        setCurrentMonth(addDays(currentMonth, 7));
        break;
      case 'month':
        setCurrentMonth(addMonths(currentMonth, 1));
        break;
      case 'quarter':
        setCurrentMonth(addMonths(currentMonth, 3));
        break;
      case 'year':
        setCurrentMonth(addMonths(currentMonth, 12));
        break;
    }
  };

  const prevPeriod = () => {
    switch (timeRange) {
      case 'day':
        setCurrentMonth(addDays(currentMonth, -1));
        break;
      case 'week':
        setCurrentMonth(addDays(currentMonth, -7));
        break;
      case 'month':
        setCurrentMonth(subMonths(currentMonth, 1));
        break;
      case 'quarter':
        setCurrentMonth(subMonths(currentMonth, 3));
        break;
      case 'year':
        setCurrentMonth(subMonths(currentMonth, 12));
        break;
    }
  };

  // Filter transactions based on view mode and workspace
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by view mode
    if (viewMode === 'past') {
      if (!isPast(transaction.date)) return false;
    } else if (viewMode === 'upcoming') {
      if (!isFuture(transaction.date)) return false;
    }

    // Filter by workspace
    if (currentWorkspace !== 'all' && transaction.category !== currentWorkspace) {
      return false;
    }

    return true;
  });

  const renderHeader = () => {
    let dateFormat;
    let periodText;
    
    switch (timeRange) {
      case 'day':
        dateFormat = "EEEE, MMMM d, yyyy";
        periodText = "Day";
        break;
      case 'week':
        dateFormat = "'Week of' MMM d, yyyy";
        periodText = "Week";
        break;
      case 'month':
        dateFormat = "MMMM yyyy";
        periodText = "Month";
        break;
      case 'quarter':
        dateFormat = "'Q'Q yyyy";
        periodText = "Quarter";
        break;
      case 'year':
        dateFormat = "yyyy";
        periodText = "Year";
        break;
      default:
        dateFormat = "MMMM yyyy";
        periodText = "Month";
    }
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevPeriod}
              className="transition-transform duration-200 hover:-translate-x-0.5"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextPeriod}
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
    let startDate, endDate;
    
    // Determine the range based on time frame
    switch (timeRange) {
      case 'day':
        startDate = startOfDay(currentMonth);
        endDate = endOfDay(currentMonth);
        return renderDayView(startDate, endDate);
      case 'week':
        startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
        endDate = endOfWeek(currentMonth, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(currentMonth);
        endDate = endOfMonth(currentMonth);
        break;
      case 'quarter':
        startDate = startOfQuarter(currentMonth);
        endDate = endOfQuarter(currentMonth);
        break;
      case 'year':
        startDate = startOfYear(currentMonth);
        endDate = endOfYear(currentMonth);
        break;
      default:
        startDate = startOfMonth(currentMonth);
        endDate = endOfMonth(currentMonth);
    }
    
    if (timeRange === 'week') {
      return renderWeekView(startDate);
    } else if (timeRange === 'day') {
      return renderDayView(startDate, endDate);
    }
    
    // For month, quarter, year - use the standard monthly calendar
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      for (let i = 0; i < 7; i++) {
        // Only include days that fall within our desired time range
        const isInRange = day >= startDate && day <= endDate;
        
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
          !isInRange && "outside-range text-muted-foreground bg-muted/50",
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
  
  // Single week view component
  const renderWeekView = (startDate: Date) => {
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      
      const dayTransactions = filteredTransactions.filter(
        (transaction) => isSameDay(transaction.date, day)
      );

      const personalExpenses = dayTransactions.filter(t => t.category === 'personal' && t.type === 'expense');
      const businessExpenses = dayTransactions.filter(t => t.category === 'business' && t.type === 'expense');
      const incomeTransactions = dayTransactions.filter(t => t.type === 'income');
      
      const totalPersonal = personalExpenses.reduce((sum, t) => sum + t.amount, 0);
      const totalBusiness = businessExpenses.reduce((sum, t) => sum + t.amount, 0);
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

      days.push(
        <div 
          key={i} 
          className={cn(
            "p-4 border rounded-lg",
            isToday(day) && "ring-1 ring-primary",
            isFuture(day) && "bg-muted/10"
          )}
          onClick={() => {
            setSelectedDate(day);
            setFormOpen(true);
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{format(day, "EEE")}</h3>
            <span className="text-sm text-muted-foreground">{format(day, "MMM d")}</span>
          </div>
          
          <div className="mt-4 space-y-2">
            {totalIncome > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-income"></div>
                  <span className="text-sm">Income</span>
                </div>
                <span className="text-sm text-income">+${totalIncome.toFixed(2)}</span>
              </div>
            )}
            
            {totalPersonal > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <CategoryDot category="personal" />
                  <span className="text-sm">Personal</span>
                </div>
                <span className="text-sm text-destructive">-${totalPersonal.toFixed(2)}</span>
              </div>
            )}
            
            {totalBusiness > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <CategoryDot category="business" />
                  <span className="text-sm">Business</span>
                </div>
                <span className="text-sm text-destructive">-${totalBusiness.toFixed(2)}</span>
              </div>
            )}
            
            {dayTransactions.length === 0 && (
              <div className="text-center py-2 text-sm text-muted-foreground">
                No transactions
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-xs" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(day);
              setFormOpen(true);
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4 mb-8">
        {days}
      </div>
    );
  };
  
  // Single day view component with hourly breakdown
  const renderDayView = (startDate: Date, endDate: Date) => {
    const dayTransactions = filteredTransactions.filter(
      (transaction) => transaction.date >= startDate && transaction.date <= endDate
    );

    // Sort transactions by time
    dayTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return (
      <div className="mb-8">
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">{format(currentMonth, "EEEE, MMMM d, yyyy")}</h3>
            <span className={cn(
              "text-sm px-2 py-1 rounded-full",
              isToday(currentMonth) ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {isToday(currentMonth) ? "Today" : isPast(currentMonth) ? "Past" : "Future"}
            </span>
          </div>
          
          {dayTransactions.length > 0 ? (
            <div className="space-y-3">
              {dayTransactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center p-2 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    transaction.type === 'income' 
                      ? 'bg-income' 
                      : transaction.category === 'personal' 
                        ? 'bg-bright-orange' 
                        : 'bg-ocean-blue'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(transaction.date, "h:mm a")} · {transaction.category || 'Income'}
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.type === 'income' 
                      ? 'text-income' 
                      : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No transactions for this day
            </div>
          )}
          
          <Button 
            className="w-full mt-4" 
            onClick={() => {
              setSelectedDate(currentMonth);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Transaction
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in">
      {renderHeader()}
      {timeRange !== 'day' && timeRange !== 'week' && renderDays()}
      {renderCells()}
    </div>
  );
};
