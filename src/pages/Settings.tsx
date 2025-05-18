
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { PreferencesSettings } from '@/components/settings/PreferencesSettings';
import { IntegrationsSettings } from '@/components/settings/IntegrationsSettings';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation, useNavigate } from 'react-router-dom';
import { BusinessManager } from '@/components/BusinessManager';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hash = location.hash.replace('#', '') as 'account' | 'appearance' | 'preferences' | 'integrations' | 'businesses';
  
  const [activeTab, setActiveTab] = useState<string>(
    hash && ['account', 'appearance', 'preferences', 'integrations', 'businesses'].includes(hash)
      ? hash
      : 'account'
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings#${value}`);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0 flex">
            <div className="w-52 border-r min-h-[500px] shrink-0">
              <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={handleTabChange}
                orientation="vertical"
                activationMode="manual"
                className="h-full"
              >
                <TabsList className="flex flex-col items-stretch bg-transparent space-y-1 p-2">
                  <TabsTrigger
                    value="account"
                    className="justify-start text-left h-9 data-[state=active]:bg-accent"
                  >
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="justify-start text-left h-9 data-[state=active]:bg-accent"
                  >
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="businesses"
                    className="justify-start text-left h-9 data-[state=active]:bg-accent"
                  >
                    Businesses
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="justify-start text-left h-9 data-[state=active]:bg-accent"
                  >
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger
                    value="integrations"
                    className="justify-start text-left h-9 data-[state=active]:bg-accent"
                  >
                    Integrations
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1">
              <ScrollArea className="h-[500px] w-full">
                <div className="p-6">
                  {activeTab === 'account' && <AccountSettings />}
                  {activeTab === 'appearance' && <AppearanceSettings />}
                  {activeTab === 'businesses' && <BusinessManager />}
                  {activeTab === 'preferences' && <PreferencesSettings />}
                  {activeTab === 'integrations' && <IntegrationsSettings />}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
