
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth'; // Updated import path
import { Business, WorkspaceOption } from '@/lib/types';

export type WorkspaceId = 'personal' | 'all' | string;

type WorkspaceContextType = {
  currentWorkspace: WorkspaceId;
  setCurrentWorkspace: (workspace: WorkspaceId) => void;
  workspaces: WorkspaceId[];
  workspaceDisplay: string;
  isValidWorkspace: (workspace: string) => boolean;
  
  // Added properties to match usage in components
  setWorkspace: (workspace: WorkspaceId) => void;
  workspaceOptions: WorkspaceOption[]; 
  businesses: Business[];
  addBusiness: (name: string, color: string) => Promise<void>;
  deleteBusiness: (businessId: string) => Promise<void>;
  getWorkspaceFilterType: () => string;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceId>('personal');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const { user } = useAuth();
  
  const workspaces: WorkspaceId[] = ['personal', 'all'];
  
  // Load saved workspace preference from localStorage on initial render
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('currentWorkspace');
    if (savedWorkspace && isValidWorkspace(savedWorkspace)) {
      setCurrentWorkspace(savedWorkspace as WorkspaceId);
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
  const addBusiness = async (name: string, color: string) => {
    if (!user) return;
    
    try {
      const newBusiness = {
        name,
        color,
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
    if (workspaces.includes(workspace as WorkspaceId)) return true;
    return businesses.some(b => b.id === workspace);
  };
  
  const workspaceDisplay = currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1);
  
  // Convert workspaces to option objects for UI components
  const workspaceOptions: WorkspaceOption[] = [
    { value: 'all', label: 'All', color: 'bg-primary' },
    { value: 'personal', label: 'Personal', color: 'bg-violet-500' },
    ...businesses.map(business => ({
      value: business.id,
      label: business.name,
      color: business.color
    }))
  ];
  
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
        workspaceOptions,
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
