
import React, { createContext, useContext, useState, useEffect } from 'react';

export type WorkspaceType = 'all' | 'personal' | 'business';

interface WorkspaceContextType {
  currentWorkspace: WorkspaceType;
  setWorkspace: (workspace: WorkspaceType) => void;
  workspaceOptions: { value: WorkspaceType; label: string }[];
}

const workspaceOptions: { value: WorkspaceType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' }
];

const WorkspaceContext = createContext<WorkspaceContextType>({
  currentWorkspace: 'all',
  setWorkspace: () => {},
  workspaceOptions,
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType>('all');

  // Load workspace from localStorage on initial render
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('workspace') as WorkspaceType;
    if (savedWorkspace && ['all', 'personal', 'business'].includes(savedWorkspace)) {
      setCurrentWorkspace(savedWorkspace);
    }
  }, []);

  const setWorkspace = (workspace: WorkspaceType) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('workspace', workspace);
  };

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setWorkspace, workspaceOptions }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
