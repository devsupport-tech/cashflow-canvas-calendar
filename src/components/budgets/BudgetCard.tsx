
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Pencil, Trash2, TrendingUp } from 'lucide-react';

interface BudgetCardProps {
  budget: {
    id: number;
    name: string;
    amount: number;
    spent: number;
    category: string;
    trend: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  animationDelay?: number;
  workspaceOptions: { value: string; label: string; color: string }[];
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ 
  budget, 
  onEdit, 
  onDelete, 
  animationDelay = 0,
  workspaceOptions
}) => {
  const percentSpent = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;
  
  // Find the workspace option for the budget category
  const categoryOption = workspaceOptions.find(option => option.value.toString() === budget.category) || {
    value: budget.category,
    label: budget.category === 'personal' ? 'Personal' : 'Business',
    color: budget.category === 'personal' ? 'bg-violet-500' : 'bg-blue-500'
  };
  
  // Determine color based on percentage spent
  const getColorClass = () => {
    if (percentSpent > 90) return 'text-red-500';
    if (percentSpent > 75) return 'text-amber-500';
    return 'text-emerald-500';
  };
  
  const getProgressBgClass = () => {
    if (percentSpent > 90) return 'bg-red-100';
    if (percentSpent > 75) return 'bg-amber-100';
    return 'bg-emerald-100';
  };
  
  const getProgressIndicatorClass = () => {
    if (percentSpent > 90) return 'bg-red-500';
    if (percentSpent > 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };
  
  return (
    <Card
      className="card-hover animate-slide-up focus-visible:ring-2 focus-visible:ring-primary"
      style={{ animationDelay: `${animationDelay}s` }}
      role="region"
      aria-labelledby={`budget-card-title-${budget.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle id={`budget-card-title-${budget.id}`} className="text-lg">{budget.name}</CardTitle>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${categoryOption.color} text-white`}
          >
            <div className="w-2 h-2 rounded-full bg-white/80" aria-hidden="true" />
            {categoryOption.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          Monthly Budget
          {budget.trend === 'up' && <ArrowUp className="h-3 w-3 text-red-500" aria-hidden="true" />}
          {budget.trend === 'down' && <ArrowDown className="h-3 w-3 text-emerald-500" aria-hidden="true" />}
          {budget.trend === 'flat' && <TrendingUp className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>
              <span className="font-medium">${budget.spent.toFixed(2)}</span> of ${budget.amount.toFixed(2)}
            </span>
            <span className={`font-medium ${getColorClass()}`}>
              {percentSpent.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={percentSpent} 
            className={`h-2 ${getProgressBgClass()}`}
            indicatorClassName={getProgressIndicatorClass()}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Remaining: <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-foreground'}`}>
            ${remaining.toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs">View Transactions</Button>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Edit budget"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive"
            aria-label="Delete budget"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
