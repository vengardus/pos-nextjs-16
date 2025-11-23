import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { getScreenSize, ScreenSizeEnum } from "@/utils/browser/get-screen-size";

export const useTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [screenSize, setScreenSize] = useState<ScreenSizeEnum>(getScreenSize());

  const [isShowForm, setIsShowForm] = useState(false);

  const handleResize = () => {
    setScreenSize(getScreenSize());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // Limpia el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setScreenSize]);

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility,
    screenSize,
    isShowForm,
    setIsShowForm,
  };
};
