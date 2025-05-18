
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CategoryBadge } from '@/components/CategoryBadge';

export interface ExpenseItem {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  expenseType: string;
}

interface ExpenseCardProps {
  expense: ExpenseItem;
  onEdit: () => void;
  onDelete: () => void;
  animationDelay?: number;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  onEdit, 
  onDelete,
  animationDelay = 0
}) => {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <Card 
      className="card-hover animate-slide-up" 
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CategoryBadge category={expense.expenseType as any} />
            <div>
              <h3 className="font-medium">{expense.description}</h3>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-semibold text-lg text-red-500">
                -${expense.amount.toFixed(2)}
              </p>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  expense.category === 'business' ? 'bg-ocean-blue text-white' : 
                  'bg-bright-orange text-white'
                }`}
              >
                {expense.category}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
