import React from "react"
import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/utils/tailwind/cn";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface InputSwitchProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  flexDirection?: "row" | "column";
  handleChange?: () => void;
}
export const SwitchForm = <T extends FieldValues>({
  control,
  name,
  label,
  flexDirection = "row",
  handleChange,
}: InputSwitchProps<T>): React.JSX.Element => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("flex", {
            "flex-row items-center justify-between": flexDirection === "row",
            "flex-col": flexDirection === "column",
          })}
        >
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl>
            <Switch
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-500"
              checked={field.value}
              onCheckedChange={(value) => {
                field.onChange(value);
                if (handleChange) handleChange();
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
