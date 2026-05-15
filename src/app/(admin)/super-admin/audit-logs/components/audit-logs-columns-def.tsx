import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "formattedDate",
    header: "Fecha",
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
      return <div className="text-xs max-w-xs truncate">{JSON.stringify(details)}</div>;
    },
  },
];
