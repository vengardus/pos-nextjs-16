"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TimePicker } from "@/components/common/time-picker";

interface TimePickerFormProps<T extends FieldValues> {
  control: import("react-hook-form").Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  intervalMinutes?: number;
  flexDirection?: "row" | "column";
  classNameButton?: string;
  classNamePopoverContent?: string;
}

export const TimePickerForm = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  intervalMinutes = 15,
  flexDirection = "column",
  classNameButton,
  classNamePopoverContent,
}: TimePickerFormProps<T>) => {
  const classFormItem =
    flexDirection === "row"
      ? "flex flex-row items-baseline"
      : "flex flex-col";
  const classLabel = flexDirection === "row" ? "w-full" : "w-full";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classFormItem}>
          {label && <FormLabel className={classLabel}>{label}:</FormLabel>}
          <FormControl>
            <TimePicker
              value={field.value ?? ""}
              onChange={(value: string) => field.onChange(value)}
              placeholder={placeholder}
              disabled={disabled}
              intervalMinutes={intervalMinutes}
              classNameButton={classNameButton}
              classNamePopoverContent={classNamePopoverContent}
            />
          </FormControl>
          {flexDirection === "column" && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
