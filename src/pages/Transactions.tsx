
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { TransactionList } from '@/components/TransactionList';
import { dummyTransactions } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download, Filter } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ImportTransactions } from '@/components/ImportTransactions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { exportTransactionsToCSV } from '@/utils/exportImport';
import { toast } from '@/components/ui/use-toast';

const Transactions = () => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  
  // Fix: Adjust the dateRange state to use the proper DateRange type
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { currentWorkspace } = useWorkspace();
  
  // Filter transactions based on selected filters and workspace
  const filteredTransactions = dummyTransactions.filter(t => {
    // Filter by workspace
    if (currentWorkspace !== 'all' && t.category && t.category !== currentWorkspace) {
      return false;
    }
    
    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      const txDate = new Date(t.date);
      return txDate >= dateRange.from && txDate <= dateRange.to;
    }
    
    return true;
  });

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      exportTransactionsToCSV(filteredTransactions);
      toast({
        title: "Export Completed",
        description: "Your transactions have been exported successfully.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your transactions.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
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
            <WorkspaceSwitcher />
            
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
            
            <Button 
              variant="outline" 
              className="gap-1"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/40 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <h3 className="text-sm font-medium">Filters</h3>
            
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
            />
            
            <Badge variant="outline" className="ml-auto">
              {currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1)} Workspace
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <Button variant="ghost" size="sm" className="ml-auto gap-1">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
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
