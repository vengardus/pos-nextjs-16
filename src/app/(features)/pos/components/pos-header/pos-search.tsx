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
      className=" border border-gray-300 rounded-xl px-3 h-12"
      ref={searchRef}
    />
  );
};
