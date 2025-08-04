/**
 * Enhanced Financial Calendar Component
 * Provides comprehensive cashflow visualization with detailed date-specific information
 */

import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarDays, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus,
  Filter,
  Eye,
  EyeOff,
  Building,
  User,
  Repeat,
  AlertCircle
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, addDays, isToday, isFuture } from 'date-fns';
import { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EnhancedCalendarProps {
  transactions: Transaction[];
  onDateSelect?: (date: Date) => void;
  onAddTransaction?: (date: Date) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
  className?: string;
}

interface DayData {
  date: Date;
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  personalTransactions: Transaction[];
  businessTransactions: Transaction[];
  hasRecurring: boolean;
  isUpcoming: boolean;
}

interface DateDetailModalProps {
  date: Date;
  dayData: DayData;
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction?: (date: Date) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

const DateDetailModal: React.FC<DateDetailModalProps> = ({
  date,
  dayData,
  isOpen,
  onClose,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'personal':
        return dayData.personalTransactions;
      case 'business':
        return dayData.businessTransactions;
      case 'income':
        return dayData.transactions.filter(t => t.type === 'income');
      case 'expenses':
        return dayData.transactions.filter(t => t.type === 'expense');
      default:
        return dayData.transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {format(date, 'EEEE, MMMM d, yyyy')}
            {isToday(date) && <Badge variant="secondary">Today</Badge>}
            {isFuture(date) && <Badge variant="outline">Upcoming</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Income</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${dayData.totalIncome.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expenses</p>
                    <p className="text-lg font-semibold text-red-600">
                      ${dayData.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className={cn(
                    "h-4 w-4",
                    dayData.netAmount >= 0 ? "text-green-600" : "text-red-600"
                  )} />
                  <div>
                    <p className="text-sm text-muted-foreground">Net</p>
                    <p className={cn(
                      "text-lg font-semibold",
                      dayData.netAmount >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      ${dayData.netAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({dayData.transactions.length})</TabsTrigger>
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-1" />
                Personal ({dayData.personalTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="business">
                <Building className="h-4 w-4 mr-1" />
                Business ({dayData.businessTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="income">
                <TrendingUp className="h-4 w-4 mr-1" />
                Income
              </TabsTrigger>
              <TabsTrigger value="expenses">
                <TrendingDown className="h-4 w-4 mr-1" />
                Expenses
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions for this filter</p>
                    {onAddTransaction && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => onAddTransaction(date)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTransactions.map((transaction, index) => (
                      <Card key={transaction.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              transaction.type === 'income' ? "bg-green-500" : "bg-red-500"
                            )} />
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {transaction.category || 'General'}
                                </Badge>
                                {transaction.expenseType && (
                                  <Badge variant="secondary" className="text-xs">
                                    {transaction.expenseType}
                                  </Badge>
                                )}
                                {dayData.hasRecurring && (
                                  <Badge variant="outline" className="text-xs">
                                    <Repeat className="h-3 w-3 mr-1" />
                                    Recurring
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "font-semibold",
                              transaction.type === 'income' ? "text-green-600" : "text-red-600"
                            )}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </p>
                            
                            {onEditTransaction && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onEditTransaction(transaction)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              {dayData.hasRecurring && (
                <Badge variant="outline" className="text-xs">
                  <Repeat className="h-3 w-3 mr-1" />
                  Has Recurring Transactions
                </Badge>
              )}
              {dayData.isUpcoming && (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Upcoming
                </Badge>
              )}
            </div>
            
            {onAddTransaction && (
              <Button onClick={() => onAddTransaction(date)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  transactions,
  onDateSelect,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [viewFilters, setViewFilters] = useState({
    showPersonal: true,
    showBusiness: true,
    showIncome: true,
    showExpenses: true
  });

  // Process transactions into daily data
  const dailyData = useMemo(() => {
    const dataMap = new Map<string, DayData>();
    
    // Initialize current month dates
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    
    for (let date = start; date <= end; date = addDays(date, 1)) {
      const dateKey = format(date, 'yyyy-MM-dd');
      dataMap.set(dateKey, {
        date: new Date(date),
        transactions: [],
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        personalTransactions: [],
        businessTransactions: [],
        hasRecurring: false,
        isUpcoming: isFuture(date)
      });
    }

    // Process transactions
    transactions.forEach(transaction => {
      const txDate = new Date(transaction.date);
      const dateKey = format(txDate, 'yyyy-MM-dd');
      const dayData = dataMap.get(dateKey);
      
      if (dayData) {
        dayData.transactions.push(transaction);
        
        if (transaction.type === 'income') {
          dayData.totalIncome += transaction.amount;
        } else {
          dayData.totalExpenses += transaction.amount;
        }
        
        if (transaction.category === 'personal') {
          dayData.personalTransactions.push(transaction);
        } else if (transaction.category === 'business') {
          dayData.businessTransactions.push(transaction);
        }
        
        // TODO: Add recurring transaction detection logic
        // dayData.hasRecurring = checkIfRecurring(transaction);
      }
    });

    // Calculate net amounts
    dataMap.forEach(dayData => {
      dayData.netAmount = dayData.totalIncome - dayData.totalExpenses;
    });

    return dataMap;
  }, [transactions, selectedDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
    onDateSelect?.(date);
  };

  const getSelectedDayData = (): DayData => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return dailyData.get(dateKey) || {
      date: selectedDate,
      transactions: [],
      totalIncome: 0,
      totalExpenses: 0,
      netAmount: 0,
      personalTransactions: [],
      businessTransactions: [],
      hasRecurring: false,
      isUpcoming: isFuture(selectedDate)
    };
  };

  // Custom day renderer for calendar
  const renderDay = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = dailyData.get(dateKey);
    
    if (!dayData) return null;

    const hasTransactions = dayData.transactions.length > 0;
    const netAmount = dayData.netAmount;

    return (
      <div className="relative w-full h-full">
        <div className={cn(
          "w-full h-full flex items-center justify-center rounded-md transition-colors cursor-pointer",
          hasTransactions && netAmount > 0 && "bg-green-100 hover:bg-green-200",
          hasTransactions && netAmount < 0 && "bg-red-100 hover:bg-red-200",
          hasTransactions && netAmount === 0 && "bg-yellow-100 hover:bg-yellow-200",
          !hasTransactions && "hover:bg-accent"
        )}>
          {format(date, 'd')}
        </div>
        
        {hasTransactions && (
          <div className="absolute bottom-0 right-0 flex gap-1">
            {dayData.personalTransactions.length > 0 && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
            {dayData.businessTransactions.length > 0 && (
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            )}
            {dayData.hasRecurring && (
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            View Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewFilters.showPersonal ? "default" : "outline"}
              size="sm"
              onClick={() => setViewFilters(prev => ({ ...prev, showPersonal: !prev.showPersonal }))}
            >
              <User className="h-4 w-4 mr-2" />
              Personal
            </Button>
            <Button
              variant={viewFilters.showBusiness ? "default" : "outline"}
              size="sm"
              onClick={() => setViewFilters(prev => ({ ...prev, showBusiness: !prev.showBusiness }))}
            >
              <Building className="h-4 w-4 mr-2" />
              Business
            </Button>
            <Button
              variant={viewFilters.showIncome ? "default" : "outline"}
              size="sm"
              onClick={() => setViewFilters(prev => ({ ...prev, showIncome: !prev.showIncome }))}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Income
            </Button>
            <Button
              variant={viewFilters.showExpenses ? "default" : "outline"}
              size="sm"
              onClick={() => setViewFilters(prev => ({ ...prev, showExpenses: !prev.showExpenses }))}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Expenses
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && handleDateClick(date)}
            month={selectedDate}
            onMonthChange={setSelectedDate}
            components={{
              Day: ({ date }) => renderDay(date)
            }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded" />
              <span>Positive cashflow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded" />
              <span>Negative cashflow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>Personal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              <span>Business</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              <span>Recurring</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Detail Modal */}
      <DateDetailModal
        date={selectedDate}
        dayData={getSelectedDayData()}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddTransaction={onAddTransaction}
        onEditTransaction={onEditTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />
    </div>
  );
};
