import { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import type { User } from "@/types/interfaces/user/user.interface";
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
}: ListColumnsDefProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Nombre" />
    ),
  },
  {
    accessorKey: "roleId",
    header: ({ column }) => (
      <div className="">
        <ListColumnSorting column={column} label="Code" />
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

export const CustomListColumnsResponsiveDef: ListColumnsResponsiveDef<User>[] =
  [
    {
      accessorKey: "name",
      screenSize: ScreenSizeEnum.xs,
    },
    // {
    //   accessorKey: "createdAt",
    //   screenSize: ScreenSizeEnum.md,
    // },
  ];
