
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type ColorAccent = 'default' | 'vivid-purple' | 'ocean-blue' | 'bright-orange';

type ColorThemeContextType = {
  colorAccent: ColorAccent;
  setColorAccent: (accent: ColorAccent) => void;
};

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export const ColorThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [colorAccent, setColorAccent] = useState<ColorAccent>('default');

  useEffect(() => {
    // Load saved color accent from localStorage
    const savedColorAccent = localStorage.getItem('colorAccent') as ColorAccent;
    if (savedColorAccent) {
      setColorAccent(savedColorAccent);
      applyColorAccent(savedColorAccent);
    }
  }, []);

  const applyColorAccent = (accent: ColorAccent) => {
    // Remove existing accent classes
    document.documentElement.classList.remove(
      'theme-default',
      'theme-vivid-purple',
      'theme-ocean-blue',
      'theme-bright-orange'
    );
    
    // Apply new accent class
    document.documentElement.classList.add(`theme-${accent}`);
    
    // Save to localStorage
    localStorage.setItem('colorAccent', accent);
  };

  const handleSetColorAccent = (accent: ColorAccent) => {
    setColorAccent(accent);
    applyColorAccent(accent);
    
    toast({
      title: "Color accent updated",
      description: `Color accent set to ${accent}`,
    });
  };

  return (
    <ColorThemeContext.Provider value={{ colorAccent, setColorAccent: handleSetColorAccent }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};
