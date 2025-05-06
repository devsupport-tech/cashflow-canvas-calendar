
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Filter, Download, X } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from '@/components/ui/use-toast';

interface DashboardFiltersProps {
  timeFrame: "day" | "week" | "month" | "quarter" | "year";
  setTimeFrame: (value: "day" | "week" | "month" | "quarter" | "year") => void;
  businessView: string;
  setBusinessView: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  timeFrame,
  setTimeFrame,
  businessView,
  setBusinessView,
  selectedDate,
  setSelectedDate,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleFilterSelect = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const handleApplyFilters = () => {
    toast({
      title: "Filters applied",
      description: `Applied ${activeFilters.length} filter(s)`,
    });
    setFilterOpen(false);
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export completed",
        description: "Financial data has been exported successfully",
      });
    }, 1500);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={timeFrame} onValueChange={(value: "day" | "week" | "month" | "quarter" | "year") => setTimeFrame(value)}>
        <SelectTrigger className="w-[130px] card-hover">
          <SelectValue placeholder="Time frame" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
          <SelectItem value="quarter">Quarterly</SelectItem>
          <SelectItem value="year">Yearly</SelectItem>
        </SelectContent>
      </Select>
      
      <Tabs value={businessView} onValueChange={setBusinessView} className="border rounded-md">
        <TabsList className="bg-transparent p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-vivid-purple data-[state=active]:to-ocean-blue data-[state=active]:text-white rounded-md">
            All
          </TabsTrigger>
          <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-bright-orange data-[state=active]:to-red-500 data-[state=active]:text-white rounded-md">
            Personal
          </TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean-blue data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md">
            Business
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="card-hover relative">
            <CalendarIcon className="h-4 w-4" />
            {selectedDate && <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <DatePicker
            date={selectedDate}
            setDate={(date) => {
              setSelectedDate(date);
              toast({
                title: "Date selected",
                description: `Viewing data for ${date?.toLocaleDateString()}`,
              });
            }}
          />
        </PopoverContent>
      </Popover>
      
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="card-hover relative">
            <Filter className="h-4 w-4" />
            {activeFilters.length > 0 && 
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-[10px] bg-primary text-white rounded-full">
                {activeFilters.length}
              </span>
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-4">
            <h4 className="font-medium">Filter Options</h4>
            
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-muted-foreground">Transaction Type</h5>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={activeFilters.includes('income') ? 'default' : 'outline'}
                  size="sm" 
                  className="justify-start"
                  onClick={() => handleFilterSelect('income')}
                >
                  Income
                </Button>
                <Button 
                  variant={activeFilters.includes('expenses') ? 'default' : 'outline'}
                  size="sm" 
                  className="justify-start"
                  onClick={() => handleFilterSelect('expenses')}
                >
                  Expenses
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline"
                size="sm" 
                onClick={() => {
                  setActiveFilters([]);
                  setFilterOpen(false);
                }}
                className="text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
              <Button 
                size="sm" 
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-1 card-hover"
        onClick={handleExport}
        isLoading={isExporting}
      >
        {!isExporting && <Download className="h-4 w-4" />}
        Export
      </Button>
    </div>
  );
};
