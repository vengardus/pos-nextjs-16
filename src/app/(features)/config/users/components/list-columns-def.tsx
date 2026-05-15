import { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import type { User } from "@/server/modules/user/domain/user.interface";
import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { ListColumnSorting } from "@/components/tables/list-column-sorting";
import { ListColumnActions } from "@/components/tables/list-column-actions";

import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";

interface ListColumnsDefProps {
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
  currentUserId: string;
  currentUserRole: string;
}
export const ListColumnsDef = ({
  handleEditRecord,
  handleDeleteRecord,
  currentUserId,
  currentUserRole,
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
    cell: ({ row }) => {
      const user = row.original;
      const isSelf = user.id === currentUserId;
      const isSuperAdmin = user.roleId === UserRole.SUPER_ADMIN;
      const isAdmin = user.roleId === UserRole.ADMIN;
      const isGuestRequester = currentUserRole === UserRole.GUEST;

      const canDelete = !isSelf && !isSuperAdmin && !isAdmin && !isGuestRequester;
      
      let deleteDisabledTitle = "";
      if (isSelf) deleteDisabledTitle = "No puedes eliminarte a ti mismo.";
      else if (isSuperAdmin || isAdmin) deleteDisabledTitle = "No se puede eliminar a un administrador.";
      else if (isGuestRequester) deleteDisabledTitle = "No tienes permisos para eliminar.";

      return (
        <ListColumnActions 
          row={row}
          handleEditRecord={handleEditRecord}
          handleDeleteRecord={handleDeleteRecord}
          canDelete={canDelete}
          deleteDisabledTitle={deleteDisabledTitle}
        />
      );
    },
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
