
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Search, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/types';
import { CategoryBadge } from './CategoryBadge';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions: allTransactions 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentWorkspace } = useWorkspace();
  
  // First filter by workspace
  const workspaceTransactions = allTransactions.filter(transaction => 
    !transaction.category || transaction.category === currentWorkspace
  );
  
  // Then filter by search query
  const filteredTransactions = workspaceTransactions.filter((transaction) => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Split transactions by type
  const expenses = filteredTransactions.filter(t => t.type === 'expense');
  const income = filteredTransactions.filter(t => t.type === 'income');
  
  const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isIncome = transaction.type === 'income';
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(transaction.amount);
    
    return (
      <div className="flex items-center justify-between py-4 border-b border-border animate-in slide-up">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            isIncome ? "bg-income/10" : "bg-destructive/10"
          )}>
            {isIncome 
              ? <ArrowUpRight className="h-4 w-4 text-income" /> 
              : <ArrowDownLeft className="h-4 w-4 text-destructive" />
            }
          </div>
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {format(transaction.date, "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {transaction.category && (
            <CategoryBadge category={transaction.category} />
          )}
          <p className={cn(
            "font-medium",
            isIncome ? "text-income" : "text-destructive"
          )}>
            {isIncome ? '+' : '-'}{formattedAmount}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
          <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          {filteredTransactions.length > 0 ? (
            <div>
              {filteredTransactions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                  />
                ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              No transactions found in {currentWorkspace} workspace
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expenses" className="pt-4">
          {expenses.length > 0 ? (
            <div>
              {expenses
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                  />
                ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              No expenses found in {currentWorkspace} workspace
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="income" className="pt-4">
          {income.length > 0 ? (
            <div>
              {income
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                  />
                ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              No income found in {currentWorkspace} workspace
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
