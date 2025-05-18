import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { ExpenseCalendar } from '@/components/ExpenseCalendar';
import { dummyTransactions } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, CalendarRange } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useWorkspace } from '@/contexts/WorkspaceContext';

const Calendar = () => {
  const { currentWorkspace, getWorkspaceFilterType } = useWorkspace();
  const [formOpen, setFormOpen] = React.useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined
  });
  const [viewType, setViewType] = useState<'calendar' | 'timeline'>('calendar');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get unique dates that have transactions for highlighting in the calendar
  const transactionDates = dummyTransactions
    .map(t => t.date.toISOString().split('T')[0])
    .filter((date, index, self) => self.indexOf(date) === index)
    .map(dateStr => new Date(dateStr));

  const filteredTransactions = dummyTransactions.filter(transaction => {
    if (!dateRange || !dateRange.from) return true;
    
    const txDate = new Date(transaction.date);
    if (dateRange.to) {
      return txDate >= dateRange.from && txDate <= dateRange.to;
    }
    
    return txDate.toDateString() === dateRange.from.toDateString();
  });

  // Use the helper function from context to determine workspace filter type
  const workspaceFilterType = getWorkspaceFilterType(currentWorkspace);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Track past and upcoming expenses
            </p>
          </div>
          
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <ExpenseForm 
              onClose={() => setFormOpen(false)} 
              initialDate={dateRange?.from}
            />
          </Dialog>
        </div>
        
        <Card className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'calendar' | 'timeline')}>
                <TabsList>
                  <TabsTrigger value="calendar" className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span className="hidden sm:inline">Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-1">
                    <CalendarRange className="h-4 w-4" />
                    <span className="hidden sm:inline">Timeline</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month' | 'quarter' | 'year')}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DatePickerWithRange 
              date={dateRange} 
              onDateChange={setDateRange} 
            />
          </div>
        </Card>
        
        {viewType === 'calendar' ? (
          <ExpenseCalendar 
            transactions={filteredTransactions} 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            viewType="month"
            workspaceFilter={workspaceFilterType}
            timeRange={timeRange}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Timeline</CardTitle>
              <CardDescription>
                View your {timeRange === 'day' ? 'daily' : 
                           timeRange === 'week' ? 'weekly' : 
                           timeRange === 'month' ? 'monthly' : 
                           timeRange === 'quarter' ? 'quarterly' : 'yearly'} transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((transaction, index) => {
                    const isPastTransaction = new Date(transaction.date) < new Date();
                    const isToday = new Date(transaction.date).toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={transaction.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-accent/30 transition-colors">
                        <div className={`w-2 h-full min-h-[12px] rounded-full ${isPastTransaction ? 'bg-muted-foreground/50' : 'bg-primary'}`}></div>
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center text-muted-foreground text-sm gap-2">
                            <span>{transaction.date.toLocaleDateString()}</span>
                            {isToday && <span className="text-primary font-medium">Today</span>}
                            {!isPastTransaction && !isToday && <span className="text-primary font-medium">Upcoming</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.type === 'income' ? 'text-income' : 'text-destructive'}`}>
                            {transaction.type === 'income' ? '+' : '-'} 
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.category || 'Income'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found for this time period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Calendar;
