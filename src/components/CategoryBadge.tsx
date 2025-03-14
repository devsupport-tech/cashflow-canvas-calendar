
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ExpenseCategory } from '@/lib/types';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category,
  className
}) => {
  return (
    <Badge 
      className={cn(
        "font-medium",
        category === 'personal' 
          ? "bg-expense-personal hover:bg-expense-personal/90" 
          : "bg-expense-business hover:bg-expense-business/90",
        className
      )}
    >
      {category === 'personal' ? 'Personal' : 'Business'}
    </Badge>
  );
};

export const CategoryDot: React.FC<CategoryBadgeProps> = ({
  category,
  className
}) => {
  return (
    <span 
      className={cn(
        "inline-block rounded-full h-2.5 w-2.5",
        category === 'personal' 
          ? "bg-expense-personal" 
          : "bg-expense-business",
        className
      )}
    />
  );
};
