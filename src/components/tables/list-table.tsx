"use client";

import { useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import { useTable } from "@/components/tables/hooks/use-table";
import { ListHeader } from "@/components/tables/list-header";
import { ListColumnVisibility } from "@/components/tables/list-column-visibility";
import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { ListTablePagination } from "./list-table-pagination";
import { ListFilter } from "./list-filter";

const PAGE_SIZE_XS = 4;
const PAGE_SIZE_SM = 5;

interface ListTableProps<TData> {
  data: TData[];
  columnsDef: ColumnDef<TData>[];
  handleAddRecord: () => void;
  columnsResponsiveDef?: ListColumnsResponsiveDef<TData>[];
  modelLabels: ModelMetadata;
}
export const ListTable = <TData,>({
  data,
  columnsDef,
  handleAddRecord,
  columnsResponsiveDef,
  modelLabels,
}: ListTableProps<TData>) => {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility,
    screenSize,
  } = useTable();

  const table = useReactTable({
    data: data,
    columns: columnsDef,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  useEffect(() => {
    table.setPageSize(screenSize === ScreenSizeEnum.xs ? PAGE_SIZE_XS : PAGE_SIZE_SM);
  }, [table, screenSize]);

  useEffect(() => {
    if (!columnsResponsiveDef) return;
    table.getAllColumns().map((column) => {
      const index = columnsResponsiveDef.findIndex((colResponsive) => colResponsive.accessorKey === column.id);
      if (index !== -1) {
        if (screenSize <= columnsResponsiveDef[index].screenSize) column.toggleVisibility(false);
        else column.toggleVisibility(true);
      }
    });
  }, [table, columnsResponsiveDef, screenSize]);

  return (
    <Card className="w-full card">
      <ListHeader handleAddRecord={handleAddRecord} modelLabels={modelLabels} />
      <CardContent className="px-1 md:px-2">
        <div className="flex justify-around items-center">
          <ListFilter modelLabels={modelLabels} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <ListColumnVisibility table={table} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getHeaderGroups()[0].headers.length} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <ListTablePagination table={table} />

      </CardContent>
    </Card>
  );
};

