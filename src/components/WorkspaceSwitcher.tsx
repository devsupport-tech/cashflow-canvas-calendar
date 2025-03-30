
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Briefcase, User } from 'lucide-react';
import { useWorkspace, WorkspaceType } from '@/contexts/WorkspaceContext';
import { cn } from '@/lib/utils';

export const WorkspaceSwitcher = () => {
  const { currentWorkspace, setWorkspace } = useWorkspace();

  // Map workspace types to their display properties
  const workspaces = {
    personal: {
      label: 'Personal',
      icon: User,
      color: 'bg-violet-500'
    },
    business: {
      label: 'Business',
      icon: Briefcase,
      color: 'bg-blue-500'
    }
  };

  // Get current workspace details
  const current = workspaces[currentWorkspace];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 p-2 h-9 bg-background">
          <div className={cn("w-4 h-4 rounded-full", current.color)} />
          <span className="font-medium">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.entries(workspaces).map(([key, workspace]) => {
          const Icon = workspace.icon;
          return (
            <DropdownMenuItem 
              key={key}
              className={cn(
                "flex items-center gap-2 py-2 cursor-pointer",
                currentWorkspace === key && "bg-accent"
              )}
              onClick={() => setWorkspace(key as WorkspaceType)}
            >
              <div className={cn("w-4 h-4 rounded-full", workspace.color)} />
              <span>{workspace.label}</span>
              <Icon className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
