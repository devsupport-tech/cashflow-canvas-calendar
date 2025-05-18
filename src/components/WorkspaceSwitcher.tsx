
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Briefcase, User, Layers, Plus } from 'lucide-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { WorkspaceOption } from '@/lib/types';

export const WorkspaceSwitcher = () => {
  const { currentWorkspace, setWorkspace, workspaceOptions, businesses } = useWorkspace();
  const navigate = useNavigate();
  
  // Find the current workspace in the options
  const currentOption = workspaceOptions.find(option => option.value === currentWorkspace);
  
  // Determine what icon to show
  const getIcon = () => {
    if (currentWorkspace === 'all') return <Layers className="h-4 w-4" />;
    if (currentWorkspace === 'personal') return <User className="h-4 w-4" />;
    return <Briefcase className="h-4 w-4" />;
  };
  
  // If we don't have a valid option, default to "All"
  const current: WorkspaceOption = currentOption || { 
    value: 'all', 
    label: 'All', 
    color: 'bg-primary' 
  };

  const handleAddBusiness = () => {
    navigate('/settings#businesses');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 p-2 h-9 bg-background">
          <div className={cn("w-4 h-4 rounded-full", current.color)} />
          <span className="font-medium">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Default workspace options */}
        <DropdownMenuItem 
          key="all"
          className={cn(
            "flex items-center gap-2 py-2 cursor-pointer",
            currentWorkspace === 'all' && "bg-accent"
          )}
          onClick={() => setWorkspace('all')}
        >
          <div className="w-4 h-4 rounded-full bg-primary" />
          <span>All</span>
          <Layers className="w-4 h-4 ml-auto" />
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          key="personal"
          className={cn(
            "flex items-center gap-2 py-2 cursor-pointer",
            currentWorkspace === 'personal' && "bg-accent"
          )}
          onClick={() => setWorkspace('personal')}
        >
          <div className="w-4 h-4 rounded-full bg-violet-500" />
          <span>Personal</span>
          <User className="w-4 h-4 ml-auto" />
        </DropdownMenuItem>
        
        {businesses.length > 0 && <DropdownMenuSeparator />}
        
        {/* Business options */}
        {businesses.map((business) => (
          <DropdownMenuItem 
            key={business.id}
            className={cn(
              "flex items-center gap-2 py-2 cursor-pointer",
              currentWorkspace === business.id && "bg-accent"
            )}
            onClick={() => setWorkspace(business.id)}
          >
            <div className={cn("w-4 h-4 rounded-full", business.color)} />
            <span>{business.name}</span>
            <Briefcase className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Add business button */}
        <DropdownMenuItem 
          className="flex items-center gap-2 py-2 cursor-pointer"
          onClick={handleAddBusiness}
        >
          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-3 h-3" />
          </div>
          <span>Add Business</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
