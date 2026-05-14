import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "@prisma/client";
import { format } from "date-fns";

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm:ss"),
  },
  {
    accessorKey: "action",
    header: "Acción",
  },
  {
    accessorKey: "entity",
    header: "Entidad",
  },
  {
    accessorKey: "userId",
    header: "Usuario ID",
  },
  {
    accessorKey: "details",
    header: "Detalles",
    cell: ({ row }) => {
      const details = row.getValue("details");
      return <pre className="text-xs">{JSON.stringify(details, null, 2)}</pre>;
    },
  },
];
