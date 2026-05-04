"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

import type { ModelMetadata } from "@/shared/types/common/model-metadata.interface";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import { useTable } from "@/components/tables/hooks/use-table";
import { ListHeader } from "@/components/tables/list-header";
import { ListColumnVisibility } from "@/components/tables/list-column-visibility";
import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { ListTablePagination } from "./list-table-pagination";
import { ListFilter } from "./list-filter";
import { SpinnerPacman } from "../common/spinners/spinner-pacman";
import { cn } from "@/utils/tailwind/cn";

const PAGE_SIZE_XS = 4;
const PAGE_SIZE_SM = 5;

interface ListTableProps<TData> {
  data: TData[];
  columnsDef: ColumnDef<TData>[];
  handleAddRecord: () => void;
  isAddDisabled?: boolean;
  columnsResponsiveDef?: ListColumnsResponsiveDef<TData>[];
  modelLabels: ModelMetadata;
  onRefresh?: () => void;
  headerActions?: ReactNode;
  showHeader?: boolean;
  showAddButton?: boolean;
  showFilter?: boolean;
  showColumnVisibility?: boolean;
  enablePagination?: boolean;
  withCard?: boolean;
  emptyStateText?: string;
  stackActionsOnMobile?: boolean;
  manualPagination?: boolean;
  pageCount?: number;
  rowCount?: number;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  manualFiltering?: boolean;
  onGlobalFilterChange?: (value: string) => void;
  isLoading?: boolean;
  stickyHeader?: boolean;
  initialGlobalFilter?: string;
}
export const ListTable = <TData,>({
  data,
  columnsDef,
  handleAddRecord,
  isAddDisabled = false,
  columnsResponsiveDef,
  modelLabels,
  onRefresh,
  headerActions,
  showHeader = true,
  showAddButton = true,
  showFilter = true,
  showColumnVisibility = true,
  enablePagination = true,
  withCard = true,
  emptyStateText,
  stackActionsOnMobile = false,
  manualPagination = false,
  pageCount,
  rowCount,
  paginationState,
  onPaginationChange,
  manualFiltering = false,
  onGlobalFilterChange: externalOnGlobalFilterChange,
  isLoading = false,
  stickyHeader = false,
  initialGlobalFilter = "",
}: ListTableProps<TData>) => {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    screenSize,
  } = useTable();
  const [clientPagination, setClientPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE_SM,
  });
  const [internalGlobalFilter, setInternalGlobalFilter] = useState(initialGlobalFilter);
  const resolvedPaginationState = paginationState ?? clientPagination;
  const resolvedOnPaginationChange =
    onPaginationChange ?? setClientPagination;

  useEffect(() => {
    setInternalGlobalFilter(initialGlobalFilter);
  }, [initialGlobalFilter]);

  const paginationConfig = enablePagination
    ? {
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination,
        pageCount,
        rowCount,
        onPaginationChange: resolvedOnPaginationChange,
      }
    : {};

  const table = useReactTable({
    data: data,
    columns: columnsDef,
    getCoreRowModel: getCoreRowModel(),
    ...paginationConfig,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: (updater) => {
      setInternalGlobalFilter(updater as string);
      if (manualFiltering && externalOnGlobalFilterChange) {
        if (typeof updater === "string") {
          externalOnGlobalFilterChange(updater);
        }
      }
    },
    manualFiltering,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter: internalGlobalFilter,
      columnVisibility,
      ...(enablePagination ? { pagination: resolvedPaginationState } : {}),
    },
  });

  useEffect(() => {
    if (!enablePagination || manualPagination) return;
    const nextPageSize =
      screenSize === ScreenSizeEnum.xs ? PAGE_SIZE_XS : PAGE_SIZE_SM;

    setClientPagination((current) => {
      if (current.pageSize === nextPageSize) return current;
      return {
        pageIndex: 0,
        pageSize: nextPageSize,
      };
    });
  }, [screenSize, enablePagination, manualPagination]);

  useEffect(() => {
    if (!columnsResponsiveDef) return;
    table.getAllColumns().forEach((column) => {
      const index = columnsResponsiveDef.findIndex(
        (colResponsive) => colResponsive.accessorKey === column.id
      );
      if (index !== -1) {
        if (screenSize <= columnsResponsiveDef[index].screenSize)
          column.toggleVisibility(false);
        else column.toggleVisibility(true);
      }
    });
  }, [table, columnsResponsiveDef, screenSize]);

  const showToolbar = showFilter || showColumnVisibility || Boolean(onRefresh);

  const tableContent = (
    <div className={cn(stickyHeader && "flex h-full min-h-0 flex-col overflow-hidden")}>
      {showToolbar && (
        <div
          className={cn(
            "flex items-center justify-between px-2",
            stickyHeader && "shrink-0 pb-2"
          )}
        >
          {showFilter && (
            <ListFilter
              modelLabels={modelLabels}
              globalFilter={internalGlobalFilter}
              setGlobalFilter={(value) => {
                setInternalGlobalFilter(value);
                if (manualFiltering && externalOnGlobalFilterChange) {
                  externalOnGlobalFilterChange(value);
                }
              }}
            />
          )}
          {onRefresh && (
            <Button variant="outline" className="ml-auto" onClick={onRefresh}>
              Refrescar
            </Button>
          )}
          {showColumnVisibility && <ListColumnVisibility table={table} />}
        </div>
      )}

        <div
          className={cn(
            "relative rounded-md border",
            stickyHeader && "flex-1 overflow-auto"
          )}
        >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <SpinnerPacman size={20} className="h-10" />
          </div>
        )}
        <Table>
          <TableHeader
            className={cn(
              "bg-secondary/70 text-xs backdrop-blur supports-[backdrop-filter]:bg-secondary/60 sm:text-sm",
              stickyHeader && "sticky top-0 z-10 bg-secondary"
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/60"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-foreground/90">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getHeaderGroups()[0].headers.length}
                  className="h-24 text-center"
                >
                  {emptyStateText ?? "No se encontraron resultados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className={cn(stickyHeader && "shrink-0 pt-2")}>
          <ListTablePagination table={table} />
        </div>
      )}
    </div>
  );

  if (!withCard) {
    return (
      <div className={cn("w-full", stickyHeader && "h-full flex flex-col")}>
        {showHeader && (
          <ListHeader
            handleAddRecord={handleAddRecord}
            modelLabels={modelLabels}
            isAddDisabled={isAddDisabled}
            headerActions={headerActions}
            showAddButton={showAddButton}
            stackActionsOnMobile={stackActionsOnMobile}
          />
        )}
        {tableContent}
      </div>
    );
  }

  return (
    <Card className={cn("w-full card", stickyHeader && "h-full flex flex-col overflow-hidden")}>
      {showHeader && (
        <ListHeader
          handleAddRecord={handleAddRecord}
          modelLabels={modelLabels}
          isAddDisabled={isAddDisabled}
          headerActions={headerActions}
          showAddButton={showAddButton}
          stackActionsOnMobile={stackActionsOnMobile}
        />
      )}
      <CardContent className={cn("px-1 md:px-2", stickyHeader && "flex-1 flex flex-col overflow-hidden pb-1")}>
        {tableContent}
      </CardContent>
    </Card>
  );
};
