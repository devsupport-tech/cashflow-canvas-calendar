
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { toast } from '@/components/ui/use-toast';
import { ExpenseItem } from './ExpenseCard';
import { exportExpensesToCSV } from '@/utils/exportImport';
import { ImportExpensesDialog } from './ImportExpensesDialog';

interface ExpenseActionsProps {
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
  editingExpense: ExpenseItem | null;
  setEditingExpense: (expense: ExpenseItem | null) => void;
  expenses: ExpenseItem[];
  onImport: (newExpenses: ExpenseItem[]) => void;
}

export const ExpenseActions: React.FC<ExpenseActionsProps> = ({
  formOpen,
  setFormOpen,
  editingExpense,
  setEditingExpense,
  expenses,
  onImport
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      exportExpensesToCSV(expenses);
      toast({
        title: "Export Completed",
        description: "Your expenses have been exported successfully.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your expenses.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open);
        if (!open) setEditingExpense(null);
      }}>
        <DialogTrigger asChild>
          <Button className="gap-1 animate-fade-in">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </DialogTrigger>
        <ExpenseForm 
          onClose={() => {
            setFormOpen(false); 
            setEditingExpense(null);
          }}
          initialExpense={editingExpense}
        />
      </Dialog>
      
      <Button 
        variant="outline" 
        className="gap-1" 
        onClick={() => setImportDialogOpen(true)}
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-1" 
        onClick={handleExport}
        disabled={isExporting}
      >
        {!isExporting && <Download className="h-4 w-4" />}
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>
      
      <ImportExpensesDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen}
        onImport={onImport}
      />
    </div>
  );
};
