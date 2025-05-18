
import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/DatePicker';
import { toast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ExpenseFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expenseFilter: string;
  setExpenseFilter: (filter: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  sortBy: 'date' | 'amount';
  setSortBy: (sortBy: 'date' | 'amount') => void;
  advancedFiltersOpen: boolean;
  setAdvancedFiltersOpen: (open: boolean) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  expenseFilter,
  setExpenseFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  advancedFiltersOpen,
  setAdvancedFiltersOpen,
}) => {
  const clearFilters = () => {
    setSearchQuery('');
    setExpenseFilter('all');
    setDateFilter(undefined);
    setAdvancedFiltersOpen(false);
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  };
  
  return (
    <div className="bg-muted/40 rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filters</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Popover open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  Advanced
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Advanced Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Fine-tune your expense list with these filters.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <DatePicker 
                      date={dateFilter} 
                      setDate={setDateFilter}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort">Sort By</Label>
                    <Select 
                      value={sortBy} 
                      onValueChange={(value) => setSortBy(value as 'date' | 'amount')}
                    >
                      <SelectTrigger id="sort">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date (newest first)</SelectItem>
                        <SelectItem value="amount">Amount (highest first)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => {
                    setAdvancedFiltersOpen(false);
                    toast({
                      title: "Filters Applied",
                      description: "Your expenses have been filtered based on your selections.",
                    });
                  }}>
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={expenseFilter} onValueChange={setExpenseFilter} className="w-full">
          <TabsList className="bg-background w-full flex-wrap h-auto py-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
            <TabsTrigger value="office">Office</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
