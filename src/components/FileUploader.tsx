
import React, { useState } from 'react';
import { Upload, CheckCircle2, XCircle, File, FileText, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface FileUploaderProps {
  type: 'statement' | 'receipt';
}

export const FileUploader: React.FC<FileUploaderProps> = ({ type }) => {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...validateFiles(newFiles)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...validateFiles(newFiles)]);
    }
  };

  const validateFiles = (newFiles: File[]) => {
    // For statements, only accept PDF and CSV files
    // For receipts, accept PDF, images, and CSV files
    const allowedTypes = type === 'statement' 
      ? ['application/pdf', 'text/csv'] 
      : ['application/pdf', 'text/csv', 'image/jpeg', 'image/png', 'image/heic'];
    
    const validFiles = newFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: `Only ${type === 'statement' ? 'PDF and CSV' : 'PDF, images, and CSV'} files are allowed.`,
        variant: "destructive"
      });
    }
    
    return validFiles;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In a real app, we would upload files here
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProgress(100);
      toast({
        title: "Upload complete",
        description: `${files.length} file${files.length !== 1 ? 's' : ''} uploaded successfully to ${currentWorkspace} workspace.`,
      });
      
      // Reset after 2 seconds
      setTimeout(() => {
        setFiles([]);
        setProgress(0);
        setUploading(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive"
      });
    } finally {
      clearInterval(interval);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <File className="h-5 w-5 text-red-500" />;
    if (file.type.includes('csv')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (file.type.includes('image')) return <ImageIcon className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <Card className="mb-6 animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'statement' ? 'Financial Statements' : 'Receipts'} 
          <Badge variant="outline">{currentWorkspace}</Badge>
        </CardTitle>
        <CardDescription>
          Upload your {type === 'statement' ? 'bank statements' : 'receipt images or PDFs'} for automatic processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            uploading && "pointer-events-none opacity-60"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-upload-${type}`)?.click()}
        >
          <input
            id={`file-upload-${type}`}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
            accept={type === 'statement' ? ".pdf,.csv" : ".pdf,.csv,.jpg,.jpeg,.png,.heic"}
          />
          
          <div className="space-y-2">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground animate-bounce" />
            <p className="text-sm font-medium">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground">
              {type === 'statement' 
                ? 'Supports PDF and CSV files up to 10MB' 
                : 'Supports images, PDF, and CSV files up to 10MB'}
            </p>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected files ({files.length})</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-accent/20">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file)}
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={uploading}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 animate-pulse" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setFiles([])} disabled={files.length === 0 || uploading}>
          Clear All
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={files.length === 0 || uploading}
          className="gap-2"
        >
          {uploading ? (
            <CheckCircle2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload {files.length > 0 && `(${files.length})`}
        </Button>
      </CardFooter>
    </Card>
  );
};
