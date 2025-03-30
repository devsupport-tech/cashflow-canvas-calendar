
import React, { useState } from 'react';
import { Upload, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ImportTransactionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportTransactions: React.FC<ImportTransactionsProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleImport = async () => {
    if (!file) return;
    
    setUploading(true);
    setImportStatus('uploading');
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In a real app, we would parse and upload the file here
      // For demo purposes, we'll just simulate a successful import
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProgress(100);
      setImportStatus('success');
      toast({
        title: "Import successful",
        description: `Imported ${file.name} successfully`,
      });
      
      // Reset after 2 seconds
      setTimeout(() => {
        setFile(null);
        setProgress(0);
        setImportStatus('idle');
        setUploading(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      setImportStatus('error');
      toast({
        title: "Import failed",
        description: "There was an error importing your transactions",
        variant: "destructive"
      });
      
      setTimeout(() => {
        setProgress(0);
        setImportStatus('idle');
        setUploading(false);
      }, 2000);
    } finally {
      clearInterval(interval);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import your transactions
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              (uploading || importStatus === 'success') && "pointer-events-none opacity-60"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading || importStatus === 'success'}
            />
            
            {file ? (
              <div className="space-y-2">
                <FileUp className="mx-auto h-8 w-8 text-primary" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground">Supports CSV files up to 10MB</p>
              </div>
            )}
          </div>
          
          {(uploading || importStatus !== 'idle') && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center gap-2">
                {importStatus === 'uploading' && (
                  <p className="text-xs text-muted-foreground">Processing file...</p>
                )}
                {importStatus === 'success' && (
                  <div className="flex items-center gap-1 text-green-500 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Import completed successfully</span>
                  </div>
                )}
                {importStatus === 'error' && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>Error processing file</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || uploading || importStatus === 'success'}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
