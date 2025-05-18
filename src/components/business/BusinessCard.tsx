
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
    <div className="border rounded-lg p-4 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-4 h-4 rounded-full ${business.color}`} />
        <h3 className="font-medium">{business.name}</h3>
      </div>
      
      <div className="flex justify-end mt-2 gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDeleteClick(business.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
