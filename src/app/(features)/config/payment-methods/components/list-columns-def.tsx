import { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { ListColumnSorting } from "@/components/tables/list-column-sorting";
import { ListColumnActions } from "@/components/tables/list-column-actions";

interface ListColumnsDefProps {
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
}
export const ListColumnsDef = ({
  handleEditRecord,
  handleDeleteRecord,
}: ListColumnsDefProps): ColumnDef<PaymentMethod>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Nombre" />
    ),
  },
  {
    accessorKey: "cod",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Código" />
    ),
  },
  {
    accessorKey: "color",
    header: ({ column }) => <ListColumnSorting column={column} label="Color" />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <div
          className="w-6 h-6 rounded-full mr-2"
          style={{ backgroundColor: row.getValue("color") }}
        />
        {row.getValue("color")}
      </div>
    ),
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

export const CustomListColumnsResponsiveDef: ListColumnsResponsiveDef<PaymentMethod>[] =
  [
    {
      accessorKey: "cod",
      screenSize: ScreenSizeEnum.xs,
    },
    // {
    //   accessorKey: "createdAt",
    //   screenSize: ScreenSizeEnum.md,
    // },
  ];
