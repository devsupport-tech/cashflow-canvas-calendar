
import React, { createContext, useContext, useState, useEffect } from 'react';

export type WorkspaceType = 'personal' | 'business';

interface WorkspaceContextType {
  currentWorkspace: WorkspaceType;
  setWorkspace: (workspace: WorkspaceType) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  currentWorkspace: 'personal',
  setWorkspace: () => {},
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType>('personal');

  // Load workspace from localStorage on initial render
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('workspace') as WorkspaceType;
    if (savedWorkspace) {
      setCurrentWorkspace(savedWorkspace);
    }
  }, []);

  const setWorkspace = (workspace: WorkspaceType) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('workspace', workspace);
  };

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
