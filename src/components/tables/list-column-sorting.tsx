import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListColumnSortingProps<T> {
    column: Column<T>;
    label: string
}
export const ListColumnSorting =<T,> ({column, label}: ListColumnSortingProps<T>) => {
  return (
    <Button
      variant="ghost"
      className="p-0"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};
