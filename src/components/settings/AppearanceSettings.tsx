
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useToast } from '@/hooks/use-toast';

export const AppearanceSettings = () => {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // Animation settings
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cardHoverEffects, setCardHoverEffects] = useState(true);
  
  // Dashboard settings
  const [compactView, setCompactView] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(true);
  
  // Color accent
  const [colorAccent, setColorAccent] = useState('default');
  
  // Handle theme change
  useEffect(() => {
    // Check if user had previously set a theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark' | 'system');
    }
    
    // Apply theme based on current setting
    applyTheme(savedTheme as 'light' | 'dark' | 'system' || 'system');
  }, []);
  
  // Apply theme when changed
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    // Remove existing classes
    root.classList.remove('light', 'dark');
    
    // Apply new theme
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };
  
  const handleThemeChange = (value: string) => {
    const newTheme = value as 'light' | 'dark' | 'system';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    toast({
      title: "Theme updated",
      description: `Theme set to ${newTheme}`,
    });
  };
  
  // Handle animation settings
  const handleAnimationsChange = (checked: boolean) => {
    setEnableAnimations(checked);
    document.body.classList.toggle('disable-animations', !checked);
    
    toast({
      title: checked ? "Animations enabled" : "Animations disabled",
      description: checked ? "App animations are now active" : "App animations are now inactive",
    });
  };
  
  const handleReduceMotionChange = (checked: boolean) => {
    setReduceMotion(checked);
    document.body.classList.toggle('reduce-motion', checked);
    
    toast({
      title: checked ? "Reduced motion enabled" : "Reduced motion disabled",
      description: checked ? "Motion effects are now reduced" : "Motion effects are now at default level",
    });
  };
  
  const handleCardHoverChange = (checked: boolean) => {
    setCardHoverEffects(checked);
    document.body.classList.toggle('disable-card-hover', !checked);
    
    toast({
      title: "Card hover effects " + (checked ? "enabled" : "disabled"),
      description: "Card hover animations have been " + (checked ? "enabled" : "disabled"),
    });
  };
  
  const handleColorAccentChange = (value: string) => {
    setColorAccent(value);
    
    // In a real implementation, you would apply the selected accent color
    // to your app's theme system
    
    toast({
      title: "Color accent updated",
      description: `Color accent set to ${value}`,
    });
  };
  
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
              <ToggleGroup 
                type="single" 
                value={theme} 
                onValueChange={handleThemeChange} 
                className="grid grid-cols-3 gap-2"
              >
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
              <RadioGroup 
                value={colorAccent} 
                onValueChange={handleColorAccentChange} 
                className="flex items-center space-x-2"
              >
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
            <Switch 
              id="animations" 
              checked={enableAnimations}
              onCheckedChange={handleAnimationsChange}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="reduce-motion" className="flex flex-col space-y-1">
              <span>Reduce motion</span>
              <span className="font-normal text-xs text-muted-foreground">Minimize animations for accessibility</span>
            </Label>
            <Switch 
              id="reduce-motion" 
              checked={reduceMotion}
              onCheckedChange={handleReduceMotionChange}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="card-hover" className="flex flex-col space-y-1">
              <span>Card hover effects</span>
              <span className="font-normal text-xs text-muted-foreground">Enable subtle hover effects on cards</span>
            </Label>
            <Switch 
              id="card-hover" 
              checked={cardHoverEffects}
              onCheckedChange={handleCardHoverChange}
            />
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
            <Switch 
              id="compact-view" 
              checked={compactView}
              onCheckedChange={(checked) => {
                setCompactView(checked);
                toast({
                  title: checked ? "Compact view enabled" : "Compact view disabled",
                  description: "Your dashboard layout has been updated",
                });
              }}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-daily-summary" className="flex flex-col space-y-1">
              <span>Show daily summary</span>
              <span className="font-normal text-xs text-muted-foreground">Display daily financial summary on dashboard</span>
            </Label>
            <Switch 
              id="show-daily-summary" 
              checked={showDailySummary}
              onCheckedChange={(checked) => {
                setShowDailySummary(checked);
                toast({
                  title: checked ? "Daily summary enabled" : "Daily summary disabled",
                  description: "Your dashboard will " + (checked ? "now" : "no longer") + " show daily summaries",
                });
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
