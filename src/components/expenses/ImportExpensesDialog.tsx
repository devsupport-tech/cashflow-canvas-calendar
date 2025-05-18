
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { ExpenseItem } from './ExpenseCard';
import { parseCSVToExpenses } from '@/utils/exportImport';
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportExpensesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (expenses: ExpenseItem[]) => void;
}

export const ImportExpensesDialog: React.FC<ImportExpensesDialogProps> = ({ 
  open, 
  onOpenChange,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<ExpenseItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError(null);
    
    // Read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const parsedExpenses = parseCSVToExpenses(csvData);
        
        if (parsedExpenses.length === 0) {
          setError('No valid expense data found in the file');
        } else {
          setPreview(parsedExpenses.slice(0, 3)); // Show preview of first 3 expenses
        }
      } catch (error) {
        setError('Failed to parse the file. Please ensure it\'s a valid CSV.');
        console.error('Parse error:', error);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
    };
    
    reader.readAsText(selectedFile);
  };
  
  const handleImport = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvData = e.target?.result as string;
          const parsedExpenses = parseCSVToExpenses(csvData);
          
          if (parsedExpenses.length > 0) {
            onImport(parsedExpenses);
            toast({
              title: "Import Successful",
              description: `Imported ${parsedExpenses.length} expenses`,
            });
            onOpenChange(false);
          } else {
            setError('No valid expense data found in the file');
          }
        } catch (error) {
          setError('Failed to parse the file');
          console.error('Parse error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the file');
        setIsLoading(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error('Import error:', error);
      setError('An error occurred during import');
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setPreview([]);
    setError(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Expenses</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your expense data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV files only</p>
              </div>
              <input 
                id="dropzone-file" 
                type="file" 
                className="hidden" 
                accept=".csv" 
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          {file && (
            <div className="mt-4">
              <p className="text-sm font-medium">Selected file: {file.name}</p>
            </div>
          )}
          
          {preview.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                {preview.map((expense, index) => (
                  <li key={index} className="truncate">
                    {expense.description}: ${expense.amount.toFixed(2)} ({expense.date})
                  </li>
                ))}
                {preview.length < 3 ? null : <li>...</li>}
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isLoading}
          >
            {isLoading ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
