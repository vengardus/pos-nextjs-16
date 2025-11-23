import React from "react"
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/utils/tailwind/cn";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxFormProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  name: Path<T>;
  data: { label: string; value: string }[];
  label?: string;
  flexDirection?: "row" | "column";
  handleSelect: (value: string, label?: string) => void;
  labelSelect?: string;
  widthButton?: string;
  isImportant?: boolean
}

export const ComboboxForm = <T extends FieldValues>({
  control,
  name,
  data,
  label,
  flexDirection = "row",
  handleSelect,
  labelSelect = "Seleccione una opción",
  widthButton="w-auto",
  isImportant=false
}: ComboboxFormProps<T>): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col">
          <FormItem
            className={cn("flex", {
              "flex-row items-baseline justify-between":
                flexDirection === "row",
              "flex-col": flexDirection === "column",
            })}
          >
            <FormLabel>{label} <span className="text-red-500 text-lg">{isImportant && "(*)" }</span></FormLabel>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl className="data-[state=open]:bg-foreground/10 hover:bg-foreground/10">
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      widthButton,
                      {
                        "text-muted-foreground": !field.value,
                      }
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {field.value
                      ? data.find((item) => item.value === field.value)?.label
                      : labelSelect}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className={`${widthButton} p-0 `}>
                <Command className="bg-background">
                  <CommandInput placeholder="Search..." className="h-9 bg-background" />
                  <CommandList className="">
                    <CommandEmpty>No result found.</CommandEmpty>
                    <CommandGroup className="">
                      {data.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            handleSelect(item.value, item.label);
                            setIsOpen(false);
                          }}
                          className="bg-foreground/5"
                        >
                          {item.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              item.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItem>
          <FormMessage />
        </div>
      )}
    />
  );
};
