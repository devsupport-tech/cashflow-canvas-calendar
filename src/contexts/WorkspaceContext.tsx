
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

export type WorkspaceType = 'all' | 'personal' | string;
export type Business = {
  id: string;
  name: string;
  color: string;
};

interface WorkspaceContextType {
  currentWorkspace: WorkspaceType;
  setWorkspace: (workspace: WorkspaceType) => void;
  workspaceOptions: { value: WorkspaceType | string; label: string; color: string }[];
  businesses: Business[];
  selectedBusiness: string | null;
  addBusiness: (name: string, color: string) => void;
  deleteBusiness: (id: string) => void;
  selectBusiness: (id: string | null) => void;
  getWorkspaceFilterType: (workspace: WorkspaceType) => 'all' | 'personal' | 'business';
}

// Default workspace options
const defaultWorkspaceOptions: { value: WorkspaceType; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'bg-primary' },
  { value: 'personal', label: 'Personal', color: 'bg-violet-500' }
];

const WorkspaceContext = createContext<WorkspaceContextType>({
  currentWorkspace: 'all',
  setWorkspace: () => {},
  workspaceOptions: defaultWorkspaceOptions,
  businesses: [],
  selectedBusiness: null,
  addBusiness: () => {},
  deleteBusiness: () => {},
  selectBusiness: () => {},
  getWorkspaceFilterType: () => 'all',
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType>('all');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  // Combined workspace options (default + businesses)
  const workspaceOptions = [
    ...defaultWorkspaceOptions,
    ...(businesses.map(business => ({
      value: business.id,
      label: business.name,
      color: business.color
    })))
  ];

  // Load businesses from Supabase when user changes
  useEffect(() => {
    const loadBusinesses = async () => {
      if (!user) {
        setBusinesses([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        setBusinesses(data.map(business => ({
          id: business.id,
          name: business.name,
          color: business.color
        })));
        
      } catch (error) {
        console.error('Error loading businesses:', error);
      }
    };

    loadBusinesses();
  }, [user]);

  // Load workspace preferences from localStorage
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('workspace');
    if (savedWorkspace) {
      setCurrentWorkspace(savedWorkspace as WorkspaceType);
    }

    const savedSelectedBusiness = localStorage.getItem('selectedBusiness');
    if (savedSelectedBusiness) {
      setSelectedBusiness(savedSelectedBusiness);
    }
  }, []);

  const setWorkspace = (workspace: WorkspaceType) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('workspace', workspace);
  };

  const addBusiness = async (name: string, color: string) => {
    if (!user) return;

    try {
      const newBusinessId = `business-${Date.now()}`;
      
      const { error } = await supabase
        .from('businesses')
        .insert({
          id: newBusinessId,
          name,
          color: color || 'bg-blue-500',
          user_id: user.id,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      const newBusiness = {
        id: newBusinessId,
        name,
        color: color || 'bg-blue-500'
      };
      
      setBusinesses(prev => [...prev, newBusiness]);
      
      // Automatically select the new business
      selectBusiness(newBusiness.id);
      
      toast({
        title: "Business created",
        description: `${name} has been added successfully.`
      });
      
    } catch (error) {
      console.error('Error adding business:', error);
      toast({
        title: "Failed to create business",
        description: "There was an error creating the business. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteBusiness = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedBusinesses = businesses.filter(business => business.id !== id);
      setBusinesses(updatedBusinesses);
      
      // If the deleted business was selected, reset to 'all'
      if (selectedBusiness === id) {
        selectBusiness(null);
        setWorkspace('all');
      }
      
      toast({
        title: "Business deleted",
        description: "The business has been deleted successfully."
      });
      
    } catch (error) {
      console.error('Error deleting business:', error);
      toast({
        title: "Failed to delete business",
        description: "There was an error deleting the business. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectBusiness = (id: string | null) => {
    setSelectedBusiness(id);
    if (id) {
      setWorkspace(id as WorkspaceType);
      localStorage.setItem('selectedBusiness', id);
    } else {
      localStorage.removeItem('selectedBusiness');
    }
  };
  
  // Helper function to determine workspaceFilterType for components that need it
  const getWorkspaceFilterType = (workspace: WorkspaceType): 'all' | 'personal' | 'business' => {
    return workspace === 'all' || workspace === 'personal' ? workspace : 'business';
  };

  return (
    <WorkspaceContext.Provider 
      value={{ 
        currentWorkspace, 
        setWorkspace, 
        workspaceOptions,
        businesses,
        selectedBusiness,
        addBusiness,
        deleteBusiness,
        selectBusiness,
        getWorkspaceFilterType
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(AuthContext) ? useContext(WorkspaceContext) : {
  currentWorkspace: 'all' as WorkspaceType,
  setWorkspace: () => {},
  workspaceOptions: defaultWorkspaceOptions,
  businesses: [] as Business[],
  selectedBusiness: null,
  addBusiness: () => {},
  deleteBusiness: () => {},
  selectBusiness: () => {},
  getWorkspaceFilterType: () => 'all' as 'all'
};
