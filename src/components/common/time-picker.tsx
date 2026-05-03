"use client";

/**
 * TimePicker base (sin react-hook-form).
 * Úsalo mediante `TimePickerForm` cuando estés dentro de un formulario.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/tailwind/cn";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  intervalMinutes?: number;
  className?: string;
  classNameButton?: string;
  classNamePopoverContent?: string;
}

const buildTimes = (intervalMinutes: number) => {
  const times: string[] = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += intervalMinutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    times.push(`${hours}:${mins}`);
  }
  return times;
};

const pad2 = (value: number) => String(value).padStart(2, "0");

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeTimeValue = (raw: string, intervalMinutes: number) => {
  if (!raw) return "";
  const sanitized = raw.replace(/[^\d:]/g, "");
  const [rawHour = "", rawMinute = ""] = sanitized.split(":");
  const hourNumber = clampNumber(Number(rawHour), 0, 23);
  let minuteNumber = clampNumber(Number(rawMinute), 0, 59);
  if (intervalMinutes > 1) {
    minuteNumber =
      Math.round(minuteNumber / intervalMinutes) * intervalMinutes;
    if (minuteNumber === 60) minuteNumber = 0;
  }
  return `${pad2(hourNumber)}:${pad2(minuteNumber)}`;
};

export const TimePicker = ({
  value,
  onChange,
  placeholder = "Seleccionar hora",
  disabled = false,
  intervalMinutes = 15,
  className,
  classNameButton,
  classNamePopoverContent,
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const times = useMemo(
    () => buildTimes(intervalMinutes),
    [intervalMinutes]
  );
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const normalizedInput = useMemo(
    () => normalizeTimeValue(query, intervalMinutes),
    [query, intervalMinutes]
  );

  const filteredTimes = useMemo(() => {
    if (!query) return times;
    return times.filter((time) => time.startsWith(query));
  }, [query, times]);

  const activeTime = filteredTimes[activeIndex] ?? filteredTimes[0] ?? "";

  useEffect(() => {
    if (!open) {
      setQuery("");
    } else {
      setActiveIndex(Math.max(0, times.indexOf(value)));
    }
  }, [open, times, value]);

  useEffect(() => {
    if (activeIndex >= filteredTimes.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredTimes.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
            classNameButton
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-56 p-3", classNamePopoverContent)}
        align="start"
      >
        <div className="mb-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="HH:mm"
            value={query}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/[^\d:]/g, "");
              setQuery(rawValue);
              setActiveIndex(0);
              if (rawValue.length === 5) {
                const nextValue = normalizeTimeValue(
                  rawValue,
                  intervalMinutes
                );
                if (times.includes(nextValue)) {
                  onChange(nextValue);
                }
              }
            }}
            onBlur={() => {
              if (times.includes(normalizedInput)) {
                onChange(normalizedInput);
              }
              setQuery("");
            }}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div
          className="max-h-56 overflow-y-auto"
          onWheel={(event) => {
            event.preventDefault();
            event.currentTarget.scrollTop += event.deltaY;
          }}
          onPointerDown={(event) => {
            dragStartY.current = event.clientY;
            isDragging.current = false;
          }}
          onPointerMove={(event) => {
            if (dragStartY.current === null) return;
            const delta = Math.abs(event.clientY - dragStartY.current);
            if (delta > 4) {
              isDragging.current = true;
            }
          }}
          onPointerUp={() => {
            dragStartY.current = null;
            setTimeout(() => {
              isDragging.current = false;
            }, 0);
          }}
          onPointerLeave={() => {
            dragStartY.current = null;
            isDragging.current = false;
          }}
        >
          <div className="flex flex-col gap-1">
            {filteredTimes.map((time, index) => (
              <Button
                key={time}
                type="button"
                variant={time === activeTime ? "default" : "ghost"}
                className="h-8 justify-start"
                onClick={() => {
                  if (isDragging.current) return;
                  onChange(time);
                  setQuery("");
                  setOpen(false);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
