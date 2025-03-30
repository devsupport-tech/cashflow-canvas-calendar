
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { PreferencesSettings } from '@/components/settings/PreferencesSettings';
import { IntegrationsSettings } from '@/components/settings/IntegrationsSettings';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4 animate-fade-in">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4 animate-fade-in">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4 animate-fade-in">
            <PreferencesSettings />
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4 animate-fade-in">
            <IntegrationsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
