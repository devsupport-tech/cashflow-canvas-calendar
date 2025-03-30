
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { TransactionList } from '@/components/TransactionList';
import { dummyTransactions } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download, Filter, Calendar } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ImportTransactions } from '@/components/ImportTransactions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/DateRangePicker';

const Transactions = () => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [businessFilter, setBusinessFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  
  // Filter transactions based on selected filters
  const filteredTransactions = dummyTransactions.filter(t => {
    // Filter by business/personal
    if (businessFilter !== 'all' && t.category !== businessFilter) {
      return false;
    }
    
    // Filter by date range
    if (dateRange.from && dateRange.to) {
      const txDate = new Date(t.date);
      return txDate >= dateRange.from && txDate <= dateRange.to;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground mt-1">
              Manage your income and expenses
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <ExpenseForm onClose={() => setFormOpen(false)} />
            </Dialog>
            
            <Button variant="outline" onClick={() => setImportOpen(true)} className="gap-1">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/40 rounded-lg p-3 mb-6 flex flex-wrap gap-3 items-center">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
          
          <Select value={businessFilter} onValueChange={setBusinessFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="sm" className="ml-auto gap-1">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
        
        <Tabs defaultValue="list" className="mb-6">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="pt-4">
            <TransactionList transactions={filteredTransactions} />
          </TabsContent>
          
          <TabsContent value="calendar" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Calendar view coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <ImportTransactions isOpen={importOpen} onClose={() => setImportOpen(false)} />
      </div>
    </MainLayout>
  );
};

export default Transactions;
