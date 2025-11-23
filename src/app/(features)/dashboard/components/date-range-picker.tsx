"use client";

import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/utils/tailwind/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDateRangePicker } from "@/app/(features)/dashboard/hooks/use-date-range-picker";
import { DateRangeTypeEnum } from "../types/date-range-type.enum";

export const DateRangePicker = () => {
  const {
    setDateRange,
    getToday,
    rangeTypeOptions,
    MIN_START_DATE,
    selectedRangeType,
    setSelectedRangeType,
    open,
    setOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    endDateOpen,
    setEndDateOpen,
    startDateOpen,
    setStartDateOpen,
    currentRangeOption,
  } = useDateRangePicker();

  // Handle range type change
  const handleRangeTypeChange = (value: DateRangeTypeEnum) => {
    setSelectedRangeType(value);
    setOpen(false);
    const option =
      rangeTypeOptions.find((opt) => opt.value === value) ||
      rangeTypeOptions[0];

    const newStartDate = option.getStartDate();
    setStartDate(newStartDate);

    const newEndDate = option.getEndDate();
    setEndDate(newEndDate);

    // Update the store
    setDateRange(newStartDate, newEndDate);
  };

  // Handle start date change
  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;

    // For BY_RANGE, validate that the start date is after MIN_START_DATE
    if (
      selectedRangeType === DateRangeTypeEnum.BY_RANGE &&
      date < MIN_START_DATE
    ) {
      setStartDate(MIN_START_DATE);

      // Ensure end date is not before start date
      if (endDate < MIN_START_DATE) {
        setEndDate(MIN_START_DATE);
        setDateRange(MIN_START_DATE, MIN_START_DATE);
      } else {
        setDateRange(MIN_START_DATE, endDate);
      }
    } else {
      setStartDate(date);
      console.log("DATE!!!", date);

      // For BY_DAY, update end date to match start date
      if (selectedRangeType === DateRangeTypeEnum.BY_DAY) {
        setEndDate(date);
        setDateRange(date, date);
      } else {
        // Ensure end date is not before start date
        if (endDate < date) {
          setEndDate(date);
          setDateRange(date, date);
        } else {
          setDateRange(date, endDate);
        }
      }
    }

    setStartDateOpen(false);
  };

  // Handle end date change
  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;

    // Ensure end date is not before start date
    if (date < startDate) {
      setEndDate(startDate);
      setDateRange(startDate, startDate);
    } else {
      setEndDate(date);
      setDateRange(startDate, date);
    }

    setEndDateOpen(false);
  };

  return (
    <Card className="w-full p-0 m-0 card">
      <CardContent className="p-2 grid md:grid-cols-[20%_80%] gap-5">
        <div className="grid gap-2">
          <Label htmlFor="range-type">Seleccione rango</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="">
              <Button
                id="range-type"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {currentRangeOption.label}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Seleccione tipo rango..." />
                <CommandList>
                  <CommandEmpty>No range type found.</CommandEmpty>
                  <CommandGroup>
                    {rangeTypeOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleRangeTypeChange(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedRangeType === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-4 md:grid-cols-2 w-full max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="start-date" className="pl-1">Fecha Inicio</Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[90%]",
                    !startDate && "text-muted-foreground"
                  )}
                  disabled={!currentRangeOption.isStartDateEditable}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                  disabled={(date) =>
                    date < MIN_START_DATE || date > getToday()
                  }
                  className="bg-foreground/5"
                />
              </PopoverContent>
            </Popover>
          </div>

          {currentRangeOption.showEndDate && (
            <div className="grid gap-2">
              <Label htmlFor="end-date" className="pl-1">Fecha Fin</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-[90%]",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={!currentRangeOption.isEndDateEditable}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    disabled={(date) => date < startDate}
                    initialFocus
                    className="bg-foreground/5"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
