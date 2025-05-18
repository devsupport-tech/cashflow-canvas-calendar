
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyBusinessStateProps {
  onAddClick: () => void;
}

export const EmptyBusinessState = ({ onAddClick }: EmptyBusinessStateProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-6 text-center">
      <Briefcase className="h-10 w-10 mx-auto text-muted-foreground" />
      <h3 className="mt-2 font-medium">No businesses yet</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Create your first business to organize your finances separately from personal expenses.
      </p>
      <Button 
        onClick={onAddClick} 
        variant="outline" 
        className="mt-4"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Business
      </Button>
    </div>
  );
};
