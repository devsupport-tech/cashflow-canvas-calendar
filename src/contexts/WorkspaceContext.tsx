
import React, { createContext, useContext, useState, useEffect } from 'react';

export type WorkspaceType = 'all' | 'personal' | 'business';
export type Business = {
  id: string;
  name: string;
  color: string;
};

interface WorkspaceContextType {
  currentWorkspace: WorkspaceType;
  setWorkspace: (workspace: WorkspaceType | string) => void;
  workspaceOptions: { value: WorkspaceType | string; label: string; color: string }[];
  businesses: Business[];
  selectedBusiness: string | null;
  addBusiness: (name: string, color: string) => void;
  deleteBusiness: (id: string) => void;
  selectBusiness: (id: string | null) => void;
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
  selectBusiness: () => {}
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType | string>('all');
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

  // Load workspace and businesses from localStorage on initial render
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('workspace');
    if (savedWorkspace) {
      setCurrentWorkspace(savedWorkspace);
    }

    const savedBusinesses = localStorage.getItem('businesses');
    if (savedBusinesses) {
      setBusinesses(JSON.parse(savedBusinesses));
    }

    const savedSelectedBusiness = localStorage.getItem('selectedBusiness');
    if (savedSelectedBusiness) {
      setSelectedBusiness(savedSelectedBusiness);
    }
  }, []);

  const setWorkspace = (workspace: WorkspaceType | string) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('workspace', workspace);
  };

  const addBusiness = (name: string, color: string) => {
    const newBusiness = {
      id: `business-${Date.now()}`,
      name,
      color: color || 'bg-blue-500'
    };
    
    const updatedBusinesses = [...businesses, newBusiness];
    setBusinesses(updatedBusinesses);
    localStorage.setItem('businesses', JSON.stringify(updatedBusinesses));
    
    // Automatically select the new business
    selectBusiness(newBusiness.id);
  };

  const deleteBusiness = (id: string) => {
    const updatedBusinesses = businesses.filter(business => business.id !== id);
    setBusinesses(updatedBusinesses);
    localStorage.setItem('businesses', JSON.stringify(updatedBusinesses));
    
    // If the deleted business was selected, reset to 'all'
    if (selectedBusiness === id) {
      selectBusiness(null);
      setWorkspace('all');
    }
  };

  const selectBusiness = (id: string | null) => {
    setSelectedBusiness(id);
    if (id) {
      setWorkspace(id);
      localStorage.setItem('selectedBusiness', id);
    } else {
      localStorage.removeItem('selectedBusiness');
    }
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
        selectBusiness
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
