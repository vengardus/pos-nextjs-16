import { ColumnDef } from "@tanstack/react-table";
// import { ScreenSizeEnum } from "@/utils/get-screen-size";
import { Role } from "@/types/interfaces/role/role.interface";
import { ListColumnSorting } from "@/components/tables/list-column-sorting";
import { ListColumnActions } from "@/components/tables/list-column-actions";
import { defineResponsiveColumns } from "@/components/tables/responsive-columns";

interface ListColumnsDefProps {
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
}
export const createListColumnsDef = <T,>(
  { handleEditRecord, handleDeleteRecord }: ListColumnsDefProps
): ColumnDef<T>[] => [
  {
    accessorKey: "description",
    header: ({ column }) => <ListColumnSorting column={column} label="Descripcion" />,
  },
  {
    accessorKey: "cod",
    header: ({ column }) => <ListColumnSorting column={column} label="Code" />,
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


export const createListColumnsResponsiveDef = defineResponsiveColumns<Role>([
  // {
  //   accessorKey: "cod",
  //   screenSize: ScreenSizeEnum.xs,
  // },
  // {
  //   accessorKey: "description",
  //   screenSize: ScreenSizeEnum.md,
  // },
  // Otros accesos de columnas aquí
]);