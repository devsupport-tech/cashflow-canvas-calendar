
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext'; // Make sure to import this

export type Workspace = 'personal' | 'business' | 'all';

type WorkspaceContextType = {
  currentWorkspace: Workspace;
  setCurrentWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  workspaceDisplay: string;
  isValidWorkspace: (workspace: string) => boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>('personal');
  const { user } = useAuth(); // Using the imported useAuth hook
  
  const workspaces: Workspace[] = ['personal', 'business', 'all'];
  
  // Load saved workspace preference from localStorage on initial render
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('currentWorkspace');
    if (savedWorkspace && isValidWorkspace(savedWorkspace)) {
      setCurrentWorkspace(savedWorkspace as Workspace);
    }
  }, []);
  
  // Save workspace preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currentWorkspace', currentWorkspace);
  }, [currentWorkspace]);
  
  const isValidWorkspace = (workspace: string): boolean => {
    return workspaces.includes(workspace as Workspace);
  };
  
  const workspaceDisplay = currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1);
  
  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        setCurrentWorkspace,
        workspaces,
        workspaceDisplay,
        isValidWorkspace
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
