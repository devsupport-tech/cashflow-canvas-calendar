
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyBusinessStateProps {
  onAddClick: () => void;
}

export const EmptyBusinessState = ({ onAddClick }: { onAddClick: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
    <img src="/assets/business-empty.svg" alt="No businesses" className="w-24 h-24 mb-4 opacity-80" aria-hidden="true" />
    <div className="font-semibold text-lg mb-2">No businesses yet</div>
    <div className="text-muted-foreground mb-4">Add your first business to manage your workspaces and finances.</div>
    <Button onClick={onAddClick} autoFocus>
      <Plus className="h-4 w-4" /> Add Business
    </Button>
  </div>
);
      </Button>
    </div>
  );
};
