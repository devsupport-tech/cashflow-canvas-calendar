/**
 * Enhanced Calendar Page
 * Comprehensive cashflow calendar with detailed date-specific information
 */

import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedCalendar } from '@/components/EnhancedCalendar';
import { useTransactionData } from '@/hooks/useTransactionData';
import { useRecurringTransactions } from '@/hooks/useRecurringTransactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Repeat,
  AlertTriangle,
  Eye,
  Settings,
  Download
} from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from '@/lib/types';

const EnhancedCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const [forecastDays, setForecastDays] = useState(30);

  const { 
    transactions, 
    isLoading, 
    error, 
    addTransactionMutation, 
    updateTransactionMutation, 
    deleteTransactionMutation 
  } = useTransactionData();

  const {
    recurringTransactions,
    generateCashflowPredictions,
    getUpcomingTransactions,
    addRecurringTransaction
  } = useRecurringTransactions();

  // Convert transactions for compatibility
  const convertedTransactions: Transaction[] = transactions.map(tx => ({
    ...tx,
    type: tx.type as 'income' | 'expense',
    expenseType: tx.expenseType as any
  }));

  // Generate cashflow predictions
  const cashflowPredictions = useMemo(() => {
    const startDate = startOfMonth(selectedDate);
    const endDate = addDays(endOfMonth(selectedDate), forecastDays);
    return generateCashflowPredictions(startDate, endDate, convertedTransactions);
  }, [selectedDate, forecastDays, convertedTransactions, generateCashflowPredictions]);

  // Get upcoming transactions
  const upcomingTransactions = useMemo(() => {
    return getUpcomingTransactions(forecastDays, convertedTransactions);
  }, [forecastDays, convertedTransactions, getUpcomingTransactions]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const today = new Date();
    const nextMonth = addDays(today, 30);
    
    const relevantPredictions = cashflowPredictions.filter(p => 
      p.date >= today && p.date <= nextMonth
    );

    const totalPredictedIncome = relevantPredictions.reduce((sum, p) => sum + p.predictedIncome, 0);
    const totalPredictedExpenses = relevantPredictions.reduce((sum, p) => sum + p.predictedExpenses, 0);
    const netPredicted = totalPredictedIncome - totalPredictedExpenses;

    const recurringIncome = recurringTransactions
      .filter(r => r.isActive && r.template.type === 'income')
      .reduce((sum, r) => sum + r.template.amount, 0);

    const recurringExpenses = recurringTransactions
      .filter(r => r.isActive && r.template.type === 'expense')
      .reduce((sum, r) => sum + r.template.amount, 0);

    return {
      totalPredictedIncome,
      totalPredictedExpenses,
      netPredicted,
      recurringIncome,
      recurringExpenses,
      upcomingCount: upcomingTransactions.length,
      recurringCount: recurringTransactions.filter(r => r.isActive).length
    };
  }, [cashflowPredictions, recurringTransactions, upcomingTransactions]);

  const handleAddTransaction = (date: Date) => {
    setSelectedDate(date);
    setFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    // TODO: Implement edit transaction modal
    console.log('Edit transaction:', transaction);
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 animate-pulse" />
            <p>Loading calendar data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">Failed to load calendar data</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Track expenses, income, and cashflow predictions across personal and business categories
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <ExpenseForm 
                onClose={() => setFormOpen(false)} 
                initialDate={selectedDate}
              />
            </Dialog>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Predicted Income (30d)</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${summaryStats.totalPredictedIncome.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Predicted Expenses (30d)</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${summaryStats.totalPredictedExpenses.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className={`h-5 w-5 ${summaryStats.netPredicted >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div>
                  <p className="text-sm text-muted-foreground">Net Predicted (30d)</p>
                  <p className={`text-2xl font-bold ${summaryStats.netPredicted >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${summaryStats.netPredicted.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Recurring & Upcoming</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{summaryStats.recurringCount} recurring</Badge>
                    <Badge variant="outline">{summaryStats.upcomingCount} upcoming</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Upcoming ({upcomingTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="recurring">
              <Repeat className="h-4 w-4 mr-2" />
              Recurring ({summaryStats.recurringCount})
            </TabsTrigger>
            <TabsTrigger value="forecast">
              <TrendingUp className="h-4 w-4 mr-2" />
              Forecast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <EnhancedCalendar
              transactions={convertedTransactions}
              onDateSelect={setSelectedDate}
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Transactions</CardTitle>
                <CardDescription>
                  Predicted transactions for the next {forecastDays} days based on patterns and recurring transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No upcoming transactions predicted</p>
                    </div>
                  ) : (
                    upcomingTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                              {transaction.isRecurring && (
                                <Badge variant="secondary" className="text-xs">
                                  <Repeat className="h-3 w-3 mr-1" />
                                  Recurring
                                </Badge>
                              )}
                              <Badge variant={
                                transaction.confidence === 'high' ? 'default' :
                                transaction.confidence === 'medium' ? 'secondary' : 'outline'
                              } className="text-xs">
                                {transaction.confidence} confidence
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurring" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recurring Transactions</CardTitle>
                <CardDescription>
                  Manage your recurring income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recurringTransactions.map((recurring) => (
                    <div key={recurring.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          recurring.template.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium">{recurring.template.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {recurring.frequency}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {recurring.template.category}
                            </Badge>
                            <span>Next: {format(recurring.nextOccurrence, 'MMM d')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          recurring.template.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {recurring.template.type === 'income' ? '+' : '-'}${recurring.template.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {recurring.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cashflow Forecast</CardTitle>
                <CardDescription>
                  Predicted cashflow for the next {forecastDays} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cashflowPredictions
                    .filter(p => p.predictedIncome > 0 || p.predictedExpenses > 0)
                    .slice(0, 10)
                    .map((prediction) => (
                      <div key={format(prediction.date, 'yyyy-MM-dd')} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{format(prediction.date, 'EEEE, MMM d')}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant={
                              prediction.confidence === 'high' ? 'default' :
                              prediction.confidence === 'medium' ? 'secondary' : 'outline'
                            } className="text-xs">
                              {prediction.confidence} confidence
                            </Badge>
                            <span>{prediction.transactions.length} transactions</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-4 text-sm">
                            <span className="text-green-600">+${prediction.predictedIncome.toFixed(2)}</span>
                            <span className="text-red-600">-${prediction.predictedExpenses.toFixed(2)}</span>
                          </div>
                          <p className={`font-semibold ${
                            prediction.predictedNet >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Net: ${prediction.predictedNet.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default EnhancedCalendarPage;
