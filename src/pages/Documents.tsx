
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/FileUploader';
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import { useWorkspace } from '@/contexts/WorkspaceContext';

const Documents = () => {
  const { currentWorkspace } = useWorkspace();
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage your financial documents
            </p>
          </div>
          
          <WorkspaceSwitcher />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FileUploader type="statement" />
          <FileUploader type="receipt" />
        </div>
        
        <Card className="mt-6 animate-slide-up">
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>
              View and manage your recently uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded to {currentWorkspace} workspace yet
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
