import { useEffect, useState } from "react";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { DialogConfirm } from "../common/dialog/dialog-confirm";

interface ListColumnActionsProps<TData> {
  row: Row<TData>;
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
}
export const ListColumnActions = <TData,>({
  row,
  handleEditRecord,
  handleDeleteRecord,
}: ListColumnActionsProps<TData>) => {
  const [isOpenDialogConfirmDelete, setIsOpenDialogConfirmDelete] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  useEffect(() => {
    if (isConfirmDelete) {
      handleDeleteRecord(row.getValue("id"));
      setIsConfirmDelete(false);
    }
  }, [isConfirmDelete, row, handleDeleteRecord]);

  return (
    <>
      <div className="flex gap-3 justify-end">
        <Pencil
          className="w-6 h-5 text-yellow-400"
          onClick={() => handleEditRecord(row.getValue("id"))}
        />
        <Trash2
          className="w-6 h-5 text-red-400"
          onClick={() => {
            setIsOpenDialogConfirmDelete(true);
          }}
        />
      </div>

      <DialogConfirm
        open={isOpenDialogConfirmDelete}
        setOpen={setIsOpenDialogConfirmDelete}
        handleAction={()=> setIsConfirmDelete(true)}
      />
    </>
  );
};
