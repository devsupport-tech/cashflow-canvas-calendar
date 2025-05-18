
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { toast } from '@/components/ui/use-toast';
import { ExpenseItem } from './ExpenseCard';

interface ExpenseActionsProps {
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
  editingExpense: ExpenseItem | null;
  setEditingExpense: (expense: ExpenseItem | null) => void;
}

export const ExpenseActions: React.FC<ExpenseActionsProps> = ({
  formOpen,
  setFormOpen,
  editingExpense,
  setEditingExpense
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Completed",
        description: "Your expenses have been exported successfully.",
      });
    }, 1500);
  };
  
  const handleImport = () => {
    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Import Completed",
        description: "Your expenses have been imported successfully.",
      });
    }, 1500);
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
        onClick={handleImport} 
        isLoading={isImporting}
        disabled={isImporting}
      >
        {!isImporting && <Upload className="h-4 w-4" />}
        Import
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-1" 
        onClick={handleExport}
        isLoading={isExporting}
        disabled={isExporting}
      >
        {!isExporting && <Download className="h-4 w-4" />}
        Export
      </Button>
    </div>
  );
};
