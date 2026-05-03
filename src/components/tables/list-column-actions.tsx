import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { DialogConfirm } from "../common/dialog/dialog-confirm";
import type { ReactNode } from "react";

interface ListColumnActionsProps<TData> {
  row: Row<TData>;
  handleEditRecord: (id: string) => void;
  handleDeleteRecord: (id: string) => void;
  customActions?: ReactNode;
  canDelete?: boolean;
  deleteDisabledTitle?: string;
}
export const ListColumnActions = <TData,>({
  row,
  handleEditRecord,
  handleDeleteRecord,
  customActions,
  canDelete = true,
  deleteDisabledTitle,
}: ListColumnActionsProps<TData>) => {
  const rowWithId = row.original as { id?: string };
  const rowId =
    rowWithId.id ??
    (typeof row.getValue("id") === "string" ? row.getValue("id") : "");

  const [isOpenDialogConfirmDelete, setIsOpenDialogConfirmDelete] = useState(false);

  return (
    <>
      <div className="flex gap-3 justify-end">
        {customActions}
        <Pencil
          className="h-5 w-6 text-warning filter brightness-90 dark:brightness-100"
          onClick={() => {
            if (!rowId) return;
            handleEditRecord(rowId);
          }}
        />
        <span title={canDelete ? "Eliminar" : deleteDisabledTitle}>
          <Trash2
            className={`w-6 h-5 ${canDelete ? "text-danger" : "text-muted-foreground opacity-40 cursor-not-allowed"}`}
            onClick={() => {
              if (!canDelete) return;
              setIsOpenDialogConfirmDelete(true);
            }}
          />
        </span>
      </div>

      <DialogConfirm
        open={isOpenDialogConfirmDelete}
        setOpen={setIsOpenDialogConfirmDelete}
        handleAction={() => {
          if (!rowId) return;
          handleDeleteRecord(rowId);
          setIsOpenDialogConfirmDelete(false);
        }}
      />
    </>
  );
};
