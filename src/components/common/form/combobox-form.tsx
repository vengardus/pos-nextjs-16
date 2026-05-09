import { useState } from "react";
import type * as React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
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
  widthButton = "w-full",
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
          ? data.find((item) => String(item.value) === String(field.value))?.label
          : labelSelect;

        return (
          <div className="flex flex-col w-full">
            <FormItem
              className={cn("flex w-full", {
                "flex-row items-baseline justify-between gap-3":
                  flexDirection === "row",
                "flex-col": flexDirection === "column",
              })}
            >
              <FormLabel>
                {label}{" "}
                {isImportant && (
                  <span className="text-md text-red-500">(*)</span>
                )}
              </FormLabel>
              
              <PopoverPrimitive.Root 
                open={isOpen} 
                onOpenChange={setIsOpen}
                modal={false}
              >
                <PopoverPrimitive.Trigger asChild>
                  <FormControl
                    className={cn(
                      "data-[state=open]:bg-foreground/10 hover:bg-foreground/10 w-full",
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
                </PopoverPrimitive.Trigger>

                {/* NOTA: Eliminamos PopoverPrimitive.Portal para evitar conflictos de foco en SlideOvers */}
                <PopoverPrimitive.Content
                  sideOffset={4}
                  align="end"
                  className={cn(
                    "z-[100] w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
                    classNamePopoverContent
                  )}
                  onInteractOutside={(e) => {
                    // Evitar que el SlideOver intercepte el clic de cierre
                    if (e.target instanceof Element && e.target.closest('[role="combobox"]')) {
                        e.preventDefault();
                    }
                  }}
                >
                  <Command className={cn("bg-background", classNameCommand)}>
                    <CommandInput
                      placeholder={commandInputPlaceholder}
                      className="h-9 bg-background"
                      autoFocus
                    />
                    <CommandList
                        className="max-h-[300px] overflow-y-auto"
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
                              "bg-foreground/5 cursor-pointer",
                              classNameCommandItem
                            )}
                          >
                            {item.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                String(item.value) === String(field.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Root>
            </FormItem>
            <FormMessage />
          </div>
        );
      }}
    />
  );
};
