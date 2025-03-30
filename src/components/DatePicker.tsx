
import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useColorTheme } from "@/contexts/ColorThemeContext";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({
  date,
  setDate,
  className,
}: DatePickerProps) {
  const { colorAccent } = useColorTheme();
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
        className={cn("p-3 pointer-events-auto", 
          colorAccent === 'vivid-purple' && "theme-vivid-purple",
          colorAccent === 'ocean-blue' && "theme-ocean-blue",
          colorAccent === 'bright-orange' && "theme-bright-orange"
        )}
      />
    </div>
  );
}
