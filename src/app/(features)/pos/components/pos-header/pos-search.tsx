"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PostSearchProps {
  handleOnChange: (value: string) => void;
  handleOnKeyDownEnter: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement|null>;
}
export const PosSearch = ({
  handleOnChange,
  handleOnKeyDownEnter,
  searchRef,
}: PostSearchProps) => {
  const [value, setValue] = useState<string>("");

  return (
    <Input
      placeholder={`Buscar...`}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        handleOnChange(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleOnKeyDownEnter((event.target as HTMLInputElement).value);
          setValue("");
        }
      }}
      className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl px-3 h-12 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
      ref={searchRef}
    />
  );
};
