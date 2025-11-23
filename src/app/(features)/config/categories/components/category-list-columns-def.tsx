import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import type { ListColumnsResponsiveDef } from "@/components/tables/types/list-columns-responsive-def.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { ListColumnSorting } from "@/components/tables/list-column-sorting";
import { ListColumnActions } from "@/components/tables/list-column-actions";

interface CategoryListColumnsDefProps {
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
}
export const categoryListColumnsDef = ({
  handleEditRecord,
  handleDeleteRecord,
}: CategoryListColumnsDefProps): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ListColumnSorting column={column} label="Nombre" />
    ),
  },
  {
    accessorKey: "imageUrl",
    header: () => <div className="">Imagen</div>,
    cell: ({ row }) => (
      <Image
        src={row.getValue("imageUrl") ?? "/placeholder.jpg"}
        alt={`${row.getValue("name")} imagen`}
        width={40}
        height={40}
        className=""
        style={{width:"40px", height:"40px"}}
      />
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
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return <ListColumnSorting column={column} label="Creado" />;
  //   },
  // },
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

export const categoryListColumnsResponsiveDef: ListColumnsResponsiveDef<Category>[] =
  [
    {
      accessorKey: "imageUrl",
      screenSize: ScreenSizeEnum.xs,
    },
    // {
    //   accessorKey: "createdAt",
    //   screenSize: ScreenSizeEnum.md,
    // },
  ];
