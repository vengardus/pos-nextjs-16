import { useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface ListTablePaginationProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
}

export const ListTablePagination = <TData,>({ table }: ListTablePaginationProps<TData>) => {
  return (
    <>
      {table.getPageCount() > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sm:hidden">Ant</span>
              <span className="hidden sm:inline">Anterior</span>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="sm:hidden">{`Pag ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}</span>
            <span className="hidden sm:inline">{`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sm:hidden">Sig</span>
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
