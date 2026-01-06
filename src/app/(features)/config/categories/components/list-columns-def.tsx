import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import type { Category } from "@/server/modules/category/domain/category.base.schema";
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
}: ListColumnsDefProps): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <ListColumnSorting column={column} label="Nombre" />,
  },
  {
    accessorKey: "imageUrl",
    header: () => <div>Imagen</div>,
    cell: ({ row }) => (
      <Image
        src={row.getValue("imageUrl") ?? "/placeholder.jpg"}
        alt={`${row.getValue("name")} imagen`}
        width={40}
        height={40}
        className="h-10 w-10 object-cover"
      />
    ),
  },
  {
    accessorKey: "color",
    header: ({ column }) => <ListColumnSorting column={column} label="Color" />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <div
          className="mr-2 h-6 w-6 rounded-full"
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

export const CustomListColumnsResponsiveDef: ListColumnsResponsiveDef<Category>[] = [
  {
    accessorKey: "imageUrl",
    screenSize: ScreenSizeEnum.xs,
  },
];
