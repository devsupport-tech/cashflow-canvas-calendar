
import React from 'react';
import { Header } from '@/components/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <WorkspaceProvider>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full">
          <Header />
          <div className="flex flex-1">
            <AppSidebar />
            <main 
              className="flex-1 py-6 px-4 md:px-6 overflow-hidden" 
              key={location.pathname}
              style={{ animation: 'fadeIn 0.3s ease-in-out' }}
            >
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0.7; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
        </div>
      </SidebarProvider>
    </WorkspaceProvider>
  );
};
