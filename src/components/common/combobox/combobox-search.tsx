"use client";

import { ReactNode, useEffect, useState } from "react";
import React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { useDebounce } from "@/hooks/debounce/use-debounce.hook";

interface ComboboxSearchProps {
  onSearch: (query: string) => Promise<{ label: string; value: string }[]>;
  handleSelect: (value: string, label?: string) => void;
  labelSelect?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  classNameButton?: string;
  classNameList?: string;
  currentValue?: string;
  label?: string;
  flexDirection?: "row" | "column";
  notFound?: ReactNode;
  placeholder?: string;
}

export const ComboboxSearch = ({
  onSearch,
  handleSelect,
  labelSelect = "Seleccione una opción",
  isOpen,
  setIsOpen,
  classNameButton = "w-[dvw] md:w-1/2",
  classNameList = "w-[100dvw] md:w-[calc(100dvw/2-20px)]",
  currentValue = "",
  flexDirection = "row",
  label,
  notFound,
  placeholder = "Buscar...",
}: ComboboxSearchProps): React.JSX.Element => {
  const [value, setValue] = useState<string>(currentValue);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchQuery.length < 2) {
        setData([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await onSearch(debouncedSearchQuery);
        setData(results);
      } catch (error) {
        console.error("Error searching:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
        fetchData();
    }
  }, [debouncedSearchQuery, onSearch, isOpen]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      // No reseteamos data inmediatamente para evitar saltos visuales si se cierra/abre rápido
    }
  }, [isOpen]);

  return (
    <div
      className={cn("flex", {
        "flex-row items-baseline": flexDirection === "row",
        "justify-between": label,
        "flex-col": flexDirection === "column",
      })}
    >
      <Label>
        {label}
        {label ? ":" : ""}
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className="">
          <Button
            name="selectButton"
            aria-label="selectButton"
            variant="outline"
            role="combobox"
            className={cn("justify-between text-[0.7rem]", classNameButton)}
            onClick={() => setIsOpen(!isOpen)}
          >
            {value
              ? data.find((item) => item.value === value)?.label || "Seleccionado"
              : labelSelect}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-0 bg-background", classNameList)}
          align="start"
        >
          <Command className="bg-background" shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              className="h-9 bg-background"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isLoading && searchQuery.length < 2 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Escriba al menos 2 caracteres para buscar...
                </div>
              )}
              {!isLoading && searchQuery.length >= 2 && data.length === 0 && (
                <CommandEmpty>
                  {notFound ? notFound : "No se encontraron resultados."}
                </CommandEmpty>
              )}
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    value={item.value}
                    key={item.value}
                    onSelect={() => {
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
