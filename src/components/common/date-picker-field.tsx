"use client";

import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker";

interface DatePickerFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  flexDirection?: "row" | "column";
  classNameButton?: string;
  classNamePopoverContent?: string;
}

export const DatePickerField = ({
  label,
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  disabled = false,
  flexDirection = "column",
  classNameButton,
  classNamePopoverContent,
}: DatePickerFieldProps) => {
  const classFormItem =
    flexDirection === "row"
      ? "flex flex-row items-baseline"
      : "flex flex-col";
  const classLabel = flexDirection === "row" ? "w-full" : "w-full";

  return (
    <div className={classFormItem}>
      {label && <Label className={classLabel}>{label}:</Label>}
      <DatePicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        classNameButton={classNameButton}
        classNamePopoverContent={classNamePopoverContent}
      />
    </div>
  );
};
