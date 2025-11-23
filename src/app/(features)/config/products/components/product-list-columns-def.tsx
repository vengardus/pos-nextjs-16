import { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import type { Product } from "@/types/interfaces/product/product.interface";
import { getScreenSize, ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { ListColumnSorting } from "@/components/tables/list-column-sorting";
import { ListColumnActions } from "@/components/tables/list-column-actions";

interface ProductListColumnsDefProps {
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
}
export const productListColumnsDef = ({
  handleEditRecord,
  handleDeleteRecord,
}: ProductListColumnsDefProps): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("name")}</div>
          {getScreenSize() <= ScreenSizeEnum.md && (
            <div className="text-sm text-gray-500">
              {row.getValue("categoryName")}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Categoría" />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("categoryName")}</div>;
    },
  },

  {
    accessorKey: "salePrice",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <ListColumnSorting column={column} label="P.Venta" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {(row.getValue("salePrice") as number).toFixed(2)}
        </div>
      );
    },
  },

  {
    accessorKey: "purchasePrice",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <ListColumnSorting column={column} label="P.Compra" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {(row.getValue("purchasePrice") as number).toFixed(2)}
        </div>
      );
    },
  },

  {
    accessorKey: "isInventoryControl",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <ListColumnSorting column={column} label="Stock?" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {(row.getValue("isInventoryControl") as boolean) ? "Si" : "No"}
        </div>
      );
    },
  },

  {
    accessorKey: "id",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => (
      <ListColumnActions
        row={row}
        handleEditRecord={handleEditRecord}
        handleDeleteRecord={handleDeleteRecord}
      />
    ),
  },
];

export const productListColumnsResponsiveDef: ListColumnsResponsiveDef<Product>[] =
  [
    {
      accessorKey: "categoryName",
      screenSize: ScreenSizeEnum.md,
    },
    {
      accessorKey: "purchasePrice",
      screenSize: ScreenSizeEnum.md,
    },
    {
      accessorKey: "isInventoryControl",
      screenSize: ScreenSizeEnum.xs,
    },
  ];
