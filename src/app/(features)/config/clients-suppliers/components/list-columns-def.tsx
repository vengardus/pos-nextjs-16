import { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";
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
}: ListColumnsDefProps): ColumnDef<ClientSupplier>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Nombre" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Teléfono" />
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

export const CustomListColumnsResponsiveDef: ListColumnsResponsiveDef<ClientSupplier>[] =
  [
    {
      accessorKey: "createdAt",
      screenSize: ScreenSizeEnum.md,
    },
  ];
