
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronRight, Plus, CreditCard, Building, Briefcase, RefreshCw } from 'lucide-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export const IntegrationsSettings = () => {
  const { currentWorkspace } = useWorkspace();
  
  return (
    <>
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Banking Connections</CardTitle>
          <CardDescription>Connect your bank accounts to automatically import transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Chase Bank</div>
                <div className="text-sm text-muted-foreground">Connected • Last synced 2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg border p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Bank of America</div>
                <div className="text-sm text-muted-foreground">Connected • Last synced 1 day ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Bank Connection
          </Button>
        </CardContent>
      </Card>
      
      {currentWorkspace === 'business' && (
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Business Integrations</CardTitle>
            <CardDescription>Connect your business tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">QuickBooks</div>
                  <div className="text-sm text-muted-foreground">Accounting software integration</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
            
            <div className="rounded-lg border p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Xero</div>
                  <div className="text-sm text-muted-foreground">Accounting and payroll integration</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Configure export settings for your financial data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="csv-format" className="flex flex-col space-y-1">
                <span>CSV Format</span>
                <span className="font-normal text-xs text-muted-foreground">Enable CSV format for exports</span>
              </Label>
              <Switch id="csv-format" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="pdf-format" className="flex flex-col space-y-1">
                <span>PDF Format</span>
                <span className="font-normal text-xs text-muted-foreground">Enable PDF format for exports</span>
              </Label>
              <Switch id="pdf-format" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="quickbooks-format" className="flex flex-col space-y-1">
                <span>QuickBooks Format</span>
                <span className="font-normal text-xs text-muted-foreground">Enable QuickBooks compatible format</span>
              </Label>
              <Switch id="quickbooks-format" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Export All Data</Button>
        </CardFooter>
      </Card>
    </>
  );
};
