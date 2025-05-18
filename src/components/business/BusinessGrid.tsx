
import React from 'react';
import { Business } from '@/lib/types';
import { BusinessCard } from './BusinessCard';

interface BusinessGridProps {
  businesses: Business[];
  onDeleteClick: (id: string) => void;
}

export const BusinessGrid = ({ businesses, onDeleteClick }: BusinessGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {businesses.map((business) => (
        <BusinessCard 
          key={business.id} 
          business={business} 
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};
