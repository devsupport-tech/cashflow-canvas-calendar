
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useWorkspace } from '@/contexts/WorkspaceContext';

export const AppearanceSettings = () => {
  const { currentWorkspace } = useWorkspace();
  
  return (
    <>
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the appearance of FlowFinance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Color Scheme</div>
              <ToggleGroup type="single" defaultValue="system" className="grid grid-cols-3 gap-2">
                <ToggleGroupItem value="light" aria-label="Light Theme" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Dark Theme" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  Dark
                </ToggleGroupItem>
                <ToggleGroupItem value="system" aria-label="System Theme" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  System
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Color Accent</div>
              <RadioGroup defaultValue="default" className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" className="bg-primary text-primary-foreground border-primary" />
                  <Label htmlFor="default">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vivid-purple" id="vivid-purple" className="bg-vivid-purple text-white border-vivid-purple" />
                  <Label htmlFor="vivid-purple">Purple</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ocean-blue" id="ocean-blue" className="bg-ocean-blue text-white border-ocean-blue" />
                  <Label htmlFor="ocean-blue">Blue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bright-orange" id="bright-orange" className="bg-bright-orange text-white border-bright-orange" />
                  <Label htmlFor="bright-orange">Orange</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Visual Effects</CardTitle>
          <CardDescription>Customize animations and visual effects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="animations" className="flex flex-col space-y-1">
              <span>Enable animations</span>
              <span className="font-normal text-xs text-muted-foreground">Smooth transitions and effects throughout the app</span>
            </Label>
            <Switch id="animations" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="reduce-motion" className="flex flex-col space-y-1">
              <span>Reduce motion</span>
              <span className="font-normal text-xs text-muted-foreground">Minimize animations for accessibility</span>
            </Label>
            <Switch id="reduce-motion" />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="card-hover" className="flex flex-col space-y-1">
              <span>Card hover effects</span>
              <span className="font-normal text-xs text-muted-foreground">Enable subtle hover effects on cards</span>
            </Label>
            <Switch id="card-hover" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>{currentWorkspace === 'personal' ? 'Personal' : 'Business'} Dashboard</CardTitle>
          <CardDescription>Customize your dashboard layout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="compact-view" className="flex flex-col space-y-1">
              <span>Compact view</span>
              <span className="font-normal text-xs text-muted-foreground">Display more information in less space</span>
            </Label>
            <Switch id="compact-view" />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-daily-summary" className="flex flex-col space-y-1">
              <span>Show daily summary</span>
              <span className="font-normal text-xs text-muted-foreground">Display daily financial summary on dashboard</span>
            </Label>
            <Switch id="show-daily-summary" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
