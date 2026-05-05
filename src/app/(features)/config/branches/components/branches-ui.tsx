"use client";

import type { BranchUser } from "@/server/modules/branch-user/domain/branch-user.interface";
import { BranchAdd } from "./branch-add";
import { BranchList } from "./branch-list";
import { BranchForm } from "./branch-form";
import { CashRegisterForm } from "./cash-register-form";
import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import { getModelMetadata } from "@/server/common/model-metadata";
import { useModalStore } from "@/stores/general/modal.store";
import { useBranchStore } from "@/stores/branch/branch.store";
import { useCashRegisterStore } from "@/stores/cash-register/cash-register.store";

interface BranchesUIProps {
  branchUsers: BranchUser[];
}
export const BranchesUI = ({ branchUsers }: BranchesUIProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const setSelectedBranch = useBranchStore((state) => state.setSelectedBranch)
  const companyId = branchUsers[0].Branch.companyId;
  const branchMetadata = getModelMetadata("branch");
  const cashRegisterMetadata = getModelMetadata("cashRegister");
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const selectedCashRegister = useCashRegisterStore((state) => state.selectedCashRegister);

  const handleAddBranch = () => {
    setSelectedBranch(null)
    setOpenModal("branch")
  }
  return (
    <section className="flex flex-col gap-8 mt-3">
      <div className="flex justify-center">
        <BranchAdd handleClick={handleAddBranch } />
      </div>
      <BranchList branchUsers={branchUsers} />
      
      {openModal === 'branch' && (
        <CustomSlideOver 
          title={`${selectedBranch ? "Editar" : "Agregar"} ${branchMetadata.singularName}`} 
          onClose={closeModal}
        >
          <BranchForm
            companyId={companyId}
            handleCloseForm={closeModal}
          />
        </CustomSlideOver>
      )}

      {openModal === 'cashRegister' && (
        <CustomSlideOver 
          title={`${selectedCashRegister ? "Editar" : "Agregar"} ${cashRegisterMetadata.singularName}`} 
          onClose={closeModal}
        >
          <CashRegisterForm
            handleCloseForm={closeModal}
          />
        </CustomSlideOver>
      )}
    </section>
  );
};
