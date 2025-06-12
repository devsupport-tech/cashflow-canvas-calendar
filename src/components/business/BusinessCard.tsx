
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Business } from '@/lib/types';

interface BusinessCardProps {
  business: Business;
  onDeleteClick: (id: string) => void;
}

export const BusinessCard = ({ business, onDeleteClick }: BusinessCardProps) => {
  return (
    <div
      className="border rounded-lg p-4 flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-primary"
      role="region"
      aria-labelledby={`business-card-title-${business.id}`}
      tabIndex={0}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-4 h-4 rounded-full ${business.color}`} aria-hidden="true" />
        <h3 id={`business-card-title-${business.id}`} className="font-medium">{business.name}</h3>
      </div>
      
      <div className="flex justify-end mt-2 gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive"
          onClick={() => onDeleteClick(business.id)}
          aria-label="Delete business"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
