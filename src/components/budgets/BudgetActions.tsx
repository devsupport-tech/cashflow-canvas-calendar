
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface BudgetActionsProps {
  setAddBudgetOpen: (open: boolean) => void;
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;
  isImporting: boolean;
  setIsImporting: (isImporting: boolean) => void;
}

export const BudgetActions: React.FC<BudgetActionsProps> = ({
  setAddBudgetOpen,
  isExporting,
  setIsExporting,
  isImporting,
  setIsImporting
}) => {
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Completed",
        description: "Your budgets have been exported successfully.",
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
        description: "Your budgets have been imported successfully.",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button className="gap-1 animate-fade-in" onClick={() => setAddBudgetOpen(true)}>
        <Plus className="h-4 w-4" />
        Create Budget
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-1" 
        onClick={handleImport}
        disabled={isImporting}
      >
        {!isImporting && <Upload className="h-4 w-4" />}
        Import
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-1" 
        onClick={handleExport}
        disabled={isExporting}
      >
        {!isExporting && <Download className="h-4 w-4" />}
        Export
      </Button>
    </div>
  );
};

export default BudgetActions;
