import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";
import { useCashRegisterStore } from "@/stores/cash-register/cash-register.store";
import { useModalStore } from "@/stores/general/modal.store";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { DialogConfirm } from "../../../../../components/common/dialog/dialog-confirm";
import { toast } from "sonner";
import { cashRegisterDeleteById } from "@/actions/cash-register/mutations/cash-register.delete-by-id.action";

interface CashRegisterItemProps {
  cashRegister: CashRegister;
}

export const CashRegisterItem = ({ cashRegister }: CashRegisterItemProps) => {
  const setSelectedCashRegister = useCashRegisterStore(
    (state) => state.setSelectedCashRegister
  );
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const [isOpenDialogConfirmDelete, setIsOpenDialogConfirmDelete] =
    useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isConfirmDelete) {
      const handleDeleteCashRegister = async () => {
        setMessage("un momento por favor...");
        const resp = await cashRegisterDeleteById(
          cashRegister.id
        );
        if (!resp.success) {
          toast.error("Error al eliminar: " + resp.message);
          setIsConfirmDelete(false);
          return;
        }
        toast.success("Eliminado exitosamente");

        setIsConfirmDelete(false);
        setMessage("");
      };

      handleDeleteCashRegister();
    }
  }, [isConfirmDelete, cashRegister]);

  const handleEditCashRegister = () => {
    setSelectedCashRegister(cashRegister);
    setOpenModal("cashRegister");
  };

  return (
    <>
      <article
        key={cashRegister.id}
        className="flex w-full items-center border p-3"
      >
        <p className="flex-1 text-center text-xl">{cashRegister.description}</p>

        <div className="flex gap-3 ml-auto">
          <Edit2Icon className="h-4 w-4" onClick={handleEditCashRegister} />
          {!cashRegister.isDefault && (
            <Trash2Icon
              className="h-4 w-4"
              onClick={() => {
                setIsOpenDialogConfirmDelete(true);
              }}
            />
          )}
        </div>
      </article>
      <p>{message}</p>

      <DialogConfirm
        open={isOpenDialogConfirmDelete}
        setOpen={setIsOpenDialogConfirmDelete}
        handleAction={() => setIsConfirmDelete(true)}
      />
    </>
  );
};
