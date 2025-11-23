import { ReactNode, useState} from "react";
import React from "react"
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/tailwind/cn";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  data: { label: string; value: string }[];
  handleSelect: (value: string, label?: string) => void;
  labelSelect?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  clasNameButton?: string;
  clasNameList?: string;
  currentValue?: string;
  label?: string;
  flexDirection?: "row" | "column";
  notFound?: ReactNode;
}

export const Combobox = ({
  data,
  handleSelect,
  labelSelect = "Seleccione una opción",
  isOpen,
  setIsOpen,
  clasNameButton = "w-[dvw] md:w-1/2",
  clasNameList = "w-[100dvw] md:w-[calc(100dvw/2-20px)]",
  currentValue = "",
  flexDirection = "row",
  label,
  notFound
}: ComboboxProps): React.JSX.Element => {
  const [value, setValue] = useState<string>(currentValue);
  return (
    <div className={cn("flex", {
      "flex-row items-baseline":
        flexDirection === "row",
        "justify-between": label,
      "flex-col": flexDirection === "column",
    })}>
      <Label>{label}{label?":":""}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen} >
        <PopoverTrigger asChild className="">
          <Button
            name="selectButton"
            aria-label="selectButton"
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between text-[0.7rem]",
              clasNameButton
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {value
              ? data.find((item) => item.value === value)?.label
              : labelSelect}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0 bg-background", clasNameList)} align="start">
          <Command className="bg-background">
            <CommandInput placeholder="Search..." className="h-9 bg-background" />
            <CommandList>
              <CommandEmpty>{notFound? notFound : "No results found."}</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    value={item.label}
                    key={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setValue(item.value);
                      handleSelect(item.value, item.label);
                      setIsOpen(false);
                    }}
                    className="bg-foreground/5"
                  >
                    {item.label}
                    {item.value === value && (
                      <Check className={cn("ml-auto")} />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
