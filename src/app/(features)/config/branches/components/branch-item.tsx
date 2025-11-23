import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { CashRegisterList } from "./cash-register-list";
import { ButtonDashed } from "../../../../../components/common/buttons/button-dashed";
import { useModalStore } from "@/stores/general/modal.store";
import { useBranchStore } from "@/stores/branch/branch.store";
import { useCashRegisterStore } from "@/stores/cash-register/cash-register.store";

interface BranchCardProps {
  branch: Branch;
}
export const BranchItem = ({ branch }: BranchCardProps) => {
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const setSelectedBranch = useBranchStore((state) => state.setSelectedBranch);
  const setSelectedCashRegister = useCashRegisterStore(
    (state) => state.setSelectedCashRegister
  );

  const handleAddCashRegister = () => {
    setSelectedBranch(branch);
    setSelectedCashRegister(null);
    setOpenModal("cashRegister");
  };

  const handleEditBranch = () => {
    console.log("edit", branch);
    setSelectedBranch(branch);
    setOpenModal("branch");
  };

  return (
    <Card className="card">
      <CardHeader className="card-header flex flex-row justify-between">
        <CardTitle className="">{`Sucursal: ${branch.name}`}</CardTitle>

        <div className="flex gap-3">
          <Edit2Icon className="h-4 w-4" onClick={handleEditBranch} />
          {!branch.isDefault && <Trash2Icon className="h-4 w-4" />}
        </div>
      </CardHeader>
      <CardContent>
        <CashRegisterList branch={branch} />
      </CardContent>
      <CardFooter className="flex justify-center">
        <ButtonDashed
          label="Agregar Caja"
          handleClick={handleAddCashRegister}
        />
      </CardFooter>
    </Card>
  );
};
