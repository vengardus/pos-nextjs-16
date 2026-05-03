"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/tailwind/cn";

interface TextareaFieldProps<T extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  flexDirection?: "row" | "column";
}

export const TextareaFieldForm = <T extends FieldValues>({
  control,
  name,
  label,
  flexDirection = "column",
  className,
  ...props
}: TextareaFieldProps<T>): React.JSX.Element => {
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
        <>
          <FormItem className={classFormItem}>
            {label && <FormLabel className={classLabel}>{label}:</FormLabel>}
            <FormControl>
              <Textarea
                className={cn(className, "input")}
                {...field}
                {...props}
              />
            </FormControl>
            {flexDirection === "column" && <FormMessage />}
          </FormItem>
          {flexDirection === "row" && <FormMessage />}
        </>
      )}
    />
  );
};
