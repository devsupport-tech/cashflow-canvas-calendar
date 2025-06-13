
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { TransactionList } from '@/components/TransactionList';
import { useTransactionData } from '@/hooks/useTransactionData';
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
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Fix: Adjust the dateRange state to use the proper DateRange type
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { currentWorkspace } = useWorkspace();
  
  // Use live transactions from backend
  const { transactions, isLoading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactionData();

  // Apply date range and type filter client-side
  const filteredTransactions = transactions.filter(t => {
    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      const txDate = new Date(t.date);
      if (txDate < dateRange.from || txDate > dateRange.to) return false;
    }
    // Transaction type filter
    if (transactionTypeFilter !== 'all' && t.type !== transactionTypeFilter) return false;
    return true;
  });

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Convert TransactionItem[] to Transaction[] for export
      const convertedTransactions = filteredTransactions.map(tx => ({
        ...tx,
        date: new Date(tx.date)
      }));
      exportTransactionsToCSV(convertedTransactions);
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
            
            <Dialog open={formOpen} onOpenChange={(open) => {
              setFormOpen(open);
              if (!open) setEditingTransaction(null);
            }}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <ExpenseForm 
                onClose={() => {
                  setFormOpen(false);
                  setEditingTransaction(null);
                }}
                initialExpense={editingTransaction}
              />
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
            {isLoading ? (
              <div className="flex flex-col gap-2 py-8">
                {/* Premium animated skeletons for transaction rows */}
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="animate-fade-in">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted to-secondary/80 rounded-lg animate-pulse">
                      <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 rounded bg-muted-foreground/20" />
                        <div className="h-3 w-1/4 rounded bg-muted-foreground/10" />
                      </div>
                      <div className="h-6 w-12 rounded bg-muted-foreground/20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-destructive animate-fade-in">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-2 animate-bounce">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                <div>Error loading transactions.</div>
                <button className="mt-2 underline" onClick={() => window.location.reload()}>Retry</button>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <img src="/assets/transactions-empty.svg" alt="No transactions" className="w-24 h-24 mb-4 opacity-80" aria-hidden="true" />
                <div className="font-semibold text-lg mb-2">No transactions yet</div>
                <div className="text-muted-foreground mb-4">Add your first transaction to start tracking your finances!</div>
                <Button onClick={() => setFormOpen(true)} autoFocus>
                  <Plus className="h-4 w-4" /> Add Transaction
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredTransactions.map((tx, idx) => {
                  // Convert TransactionItem to Transaction for TransactionList
                  const convertedTx = {
                    ...tx,
                    date: new Date(tx.date)
                  };
                  return (
                    <div key={tx.id} className="animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                      <TransactionList 
                        transactions={[convertedTx]} 
                        onEdit={(transaction) => {
                          // Convert back to TransactionItem for editing
                          const editTx = {
                            ...transaction,
                            date: transaction.date.toISOString()
                          };
                          setFormOpen(true);
                          setEditingTransaction(editTx);
                        }}
                        onDelete={async (id) => {
                          if (window.confirm('Are you sure you want to delete this transaction?')) {
                            await deleteTransaction(id);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
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
