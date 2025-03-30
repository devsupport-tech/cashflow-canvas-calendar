
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from '@/contexts/WorkspaceContext';

export const PreferencesSettings = () => {
  const { currentWorkspace } = useWorkspace();
  
  return (
    <>
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email notifications</span>
              <span className="font-normal text-xs text-muted-foreground">Receive important updates via email</span>
            </Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push notifications</span>
              <span className="font-normal text-xs text-muted-foreground">Receive notifications in your browser</span>
            </Label>
            <Switch id="push-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="transaction-alerts" className="flex flex-col space-y-1">
              <span>Transaction alerts</span>
              <span className="font-normal text-xs text-muted-foreground">Get notified about new transactions</span>
            </Label>
            <Switch id="transaction-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="budget-alerts" className="flex flex-col space-y-1">
              <span>Budget alerts</span>
              <span className="font-normal text-xs text-muted-foreground">Get notified when approaching budget limits</span>
            </Label>
            <Switch id="budget-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
          <CardDescription>Customize regional preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="cad">CAD ($)</SelectItem>
                  <SelectItem value="aud">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select defaultValue="mdy">
                <SelectTrigger id="date-format">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>{currentWorkspace === 'personal' ? 'Personal' : 'Business'} Preferences</CardTitle>
          <CardDescription>Customize preferences for your {currentWorkspace} workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="default-workspace" className="flex flex-col space-y-1">
              <span>Set as default workspace</span>
              <span className="font-normal text-xs text-muted-foreground">Make {currentWorkspace} workspace your default view</span>
            </Label>
            <Switch id="default-workspace" defaultChecked={currentWorkspace === 'personal'} />
          </div>
          
          {currentWorkspace === 'business' && (
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="tax-calculation" className="flex flex-col space-y-1">
                <span>Automatic tax calculation</span>
                <span className="font-normal text-xs text-muted-foreground">Calculate taxes for business transactions</span>
              </Label>
              <Switch id="tax-calculation" defaultChecked />
            </div>
          )}
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="expense-categorization" className="flex flex-col space-y-1">
              <span>Automatic expense categorization</span>
              <span className="font-normal text-xs text-muted-foreground">Automatically categorize new expenses</span>
            </Label>
            <Switch id="expense-categorization" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
