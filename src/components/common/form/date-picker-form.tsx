"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/common/date-picker";

interface DatePickerFormProps<T extends FieldValues> {
  control: import("react-hook-form").Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  flexDirection?: "row" | "column";
  classNameButton?: string;
  classNamePopoverContent?: string;
}

export const DatePickerForm = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  minDate,
  maxDate,
  disabled = false,
  flexDirection = "column",
  classNameButton,
  classNamePopoverContent,
}: DatePickerFormProps<T>) => {
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
            <DatePicker
              value={field.value ?? ""}
              onChange={(value: string) => field.onChange(value)}
              placeholder={placeholder}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
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
