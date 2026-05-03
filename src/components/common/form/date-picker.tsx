"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/tailwind/cn";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  className?: string;
  classNameButton?: string;
  classNamePopoverContent?: string;
}

const parseDateValue = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  minDate,
  maxDate,
  disabled = false,
  className,
  classNameButton,
  classNamePopoverContent,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const minDateValue = useMemo(() => parseDateValue(minDate), [minDate]);
  const maxDateValue = useMemo(() => parseDateValue(maxDate), [maxDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className,
            classNameButton
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0", classNamePopoverContent)}
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) return;
            onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
          }}
          disabled={(date) => {
            if (minDateValue && date < minDateValue) return true;
            if (maxDateValue && date > maxDateValue) return true;
            return false;
          }}
          initialFocus
          className="bg-foreground/5"
        />
      </PopoverContent>
    </Popover>
  );
};
