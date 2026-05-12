import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const LogsColumnsDef = (): ColumnDef<any>[] => [
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => <span className="font-mono text-primary">{row.original.action}</span>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
  },
  {
    accessorKey: "User.email",
    header: "Usuario",
    cell: ({ row }) => <span>{row.original.User?.email ?? "N/A"}</span>,
  },
  {
    accessorKey: "countryCode",
    header: "País",
    cell: ({ row }) => <span>{row.original.countryCode ?? "-"}</span>,
  },
  {
    accessorKey: "deviceType",
    header: "Disp.",
    cell: ({ row }) => <span>{row.original.deviceType ?? "-"}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => <span>{format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm:ss")}</span>,
  },
  {
    accessorKey: "timezone",
    header: "Zona horaria",
    cell: ({ row }) => <span>{row.original.timezone ?? "-"}</span>,
  },
];
