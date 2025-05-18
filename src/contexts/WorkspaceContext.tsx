
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type Workspace = 'personal' | 'business' | 'all';
export type WorkspaceType = Workspace; // For backward compatibility

// Business type for any custom businesses
export interface Business {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

type WorkspaceContextType = {
  currentWorkspace: Workspace;
  setCurrentWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  workspaceDisplay: string;
  isValidWorkspace: (workspace: string) => boolean;
  
  // Added properties to match usage in components
  setWorkspace: (workspace: Workspace) => void;
  workspaceOptions: Workspace[]; 
  businesses: Business[];
  addBusiness: (business: Omit<Business, 'id' | 'createdAt'>) => Promise<void>;
  deleteBusiness: (businessId: string) => Promise<void>;
  getWorkspaceFilterType: () => string;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>('personal');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const { user } = useAuth();
  
  const workspaces: Workspace[] = ['personal', 'business', 'all'];
  
  // Load saved workspace preference from localStorage on initial render
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('currentWorkspace');
    if (savedWorkspace && isValidWorkspace(savedWorkspace)) {
      setCurrentWorkspace(savedWorkspace as Workspace);
    }
    
    // Load businesses if user is logged in
    if (user) {
      loadBusinesses();
    }
  }, [user]);
  
  // Load businesses from Supabase
  const loadBusinesses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    }
  };
  
  // Add a new business
  const addBusiness = async (business: Omit<Business, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      const newBusiness = {
        ...business,
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('businesses')
        .insert(newBusiness);
        
      if (error) throw error;
      
      await loadBusinesses();
    } catch (error) {
      console.error('Error adding business:', error);
    }
  };
  
  // Delete a business
  const deleteBusiness = async (businessId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      await loadBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };
  
  // Save workspace preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currentWorkspace', currentWorkspace);
  }, [currentWorkspace]);
  
  const isValidWorkspace = (workspace: string): boolean => {
    return workspaces.includes(workspace as Workspace);
  };
  
  const workspaceDisplay = currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1);
  
  // Get workspace filter type for components that need it
  const getWorkspaceFilterType = () => {
    return currentWorkspace === 'all' ? '' : currentWorkspace;
  };
  
  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        setCurrentWorkspace,
        workspaces,
        workspaceDisplay,
        isValidWorkspace,
        // Aliases and additional properties
        setWorkspace: setCurrentWorkspace,
        workspaceOptions: workspaces,
        businesses,
        addBusiness,
        deleteBusiness,
        getWorkspaceFilterType
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
