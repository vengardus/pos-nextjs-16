import { useState } from "react";
import type * as React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { cn } from "@/utils/tailwind/cn";

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
  isImportant?: boolean;
  classNameFormControl?: string;
  classNameButton?: string;
  classNamePopoverContent?: string;
  classNameCommand?: string;
  classNameCommandItem?: string;
  commandInputPlaceholder?: string;
  commandEmptyMessage?: string;
  isLoading?: boolean;
}

export const ComboboxForm = <T extends FieldValues>({
  control,
  name,
  data,
  label,
  flexDirection = "row",
  handleSelect,
  labelSelect = "Seleccione una opción",
  widthButton = "w-auto",
  isImportant = false,
  classNameFormControl,
  classNameButton,
  classNamePopoverContent,
  classNameCommand,
  classNameCommandItem,
  commandInputPlaceholder = "Buscar...",
  commandEmptyMessage = "No result found.",
  isLoading = false,
  disabled,
}: ComboboxFormProps<T>): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const isInteractionDisabled = disabled || isLoading;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedLabel = field.value
          ? data.find((item) => item.value === field.value)?.label
          : labelSelect;

        return (
          <div className="flex flex-col">
            <FormItem
              className={cn("flex", {
                "flex-row items-baseline justify-between":
                  flexDirection === "row",
                "flex-col": flexDirection === "column",
              })}
            >
              <FormLabel>
                {label}{" "}
                {isImportant && (
                  <span className="text-lg text-red-500">(*)</span>
                )}
              </FormLabel>
              <Popover
                open={isOpen}
                onOpenChange={(nextOpen) => {
                  if (isInteractionDisabled) return;
                  setIsOpen(nextOpen);
                }}
              >
                <PopoverTrigger asChild>
                  <FormControl
                    className={cn(
                      "data-[state=open]:bg-foreground/10 hover:bg-foreground/10",
                      classNameFormControl
                    )}
                  >
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "flex items-center justify-between gap-2",
                        widthButton,
                        {
                          "text-muted-foreground": !field.value,
                        },
                        classNameButton
                      )}
                      onClick={() => {
                        if (isInteractionDisabled) return;
                        setIsOpen((current) => !current);
                      }}
                      disabled={isInteractionDisabled}
                    >
                      <span
                        className="min-w-0 flex-1 truncate text-left"
                        title={selectedLabel}
                      >
                        {selectedLabel}
                      </span>
                      {isLoading ? (
                        <Loader2 className="shrink-0 animate-spin opacity-50" />
                      ) : (
                        <ChevronsUpDown className="shrink-0 opacity-50" />
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className={cn(widthButton, "p-0", classNamePopoverContent)}
                >
                  <Command className={cn("bg-background", classNameCommand)}>
                    <CommandInput
                      placeholder={commandInputPlaceholder}
                      className="h-9 bg-background"
                    />
                    <CommandList
                      onWheel={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        event.currentTarget.scrollTop += event.deltaY;
                      }}
                    >
                      <CommandEmpty>{commandEmptyMessage}</CommandEmpty>
                      <CommandGroup>
                        {data.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              handleSelect(item.value, item.label);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "bg-foreground/5",
                              classNameCommandItem
                            )}
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
        );
      }}
    />
  );
};
