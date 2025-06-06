"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerDemoProps {
  onDateChange: (date: string) => void;
  className?: string;
}

export function DatePickerDemo({
  onDateChange,
  className,
}: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  if (typeof window === "undefined") {
    return <div className={className} />;
  }

  React.useEffect(() => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  }, [onDateChange]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate || new Date());
    onDateChange(format(selectedDate || new Date(), "yyyy-MM-dd"));
    setIsPopoverOpen(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-10 justify-start text-left font-normal border border-slate-500",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(day: Date) =>
            day < new Date() ||
            day > new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
