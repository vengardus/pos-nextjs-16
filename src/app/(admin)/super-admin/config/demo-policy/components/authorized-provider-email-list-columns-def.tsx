import type { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { ListColumnSorting } from "@/components/tables/list-column-sorting";
import { ListColumnActions } from "@/components/tables/list-column-actions";
import type { AuthorizedProviderEmail } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";

interface ListColumnsDefProps {
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
}

export const AuthorizedProviderEmailListColumnsDef = ({
  handleEditRecord,
  handleDeleteRecord,
}: ListColumnsDefProps): ColumnDef<AuthorizedProviderEmail>[] => [
  {
    accessorKey: "email",
    header: ({ column }) => <ListColumnSorting column={column} label="Email" />,
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Cliente" />
    ),
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Fecha Expiración" />
    ),
  },
  {
    id: "status",
    accessorFn: (row) => (row.isActive ? "Activo" : "Inactivo"),
    header: ({ column }) => <ListColumnSorting column={column} label="Estado" />,
    cell: ({ row }) => (row.original.isActive ? "Activo" : "Inactivo"),
  },
  {
    id: "bootstrapRole",
    accessorFn: (row) => (row.isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"),
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Bootstrap Rol" />
    ),
    cell: ({ row }) => (row.original.isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"),
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

export const AuthorizedProviderEmailColumnsResponsiveDef: ListColumnsResponsiveDef<AuthorizedProviderEmail>[] =
  [
    {
      accessorKey: "clientName",
      screenSize: ScreenSizeEnum.sm,
    },
    {
      accessorKey: "expirationDate",
      screenSize: ScreenSizeEnum.sm,
    },
    {
      accessorKey: "isSuperAdmin",
      screenSize: ScreenSizeEnum.sm,
    },
  ];
