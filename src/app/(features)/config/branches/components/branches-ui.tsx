"use client";

import type { BranchUser } from "@/server/modules/branch-user/domain/branch-user.interface";
import { BranchAdd } from "./branch-add";
import { BranchList } from "./branch-list";
import { BranchForm } from "./branch-form";
import { Modal } from "../../../../../components/common/modals/modal";
import { CashRegisterForm } from "./cash-register-form";
import { useModalStore } from "@/stores/general/modal.store";
import { useBranchStore } from "@/stores/branch/branch.store";

interface BranchesUIProps {
  branchUsers: BranchUser[];
}
export const BranchesUI = ({ branchUsers }: BranchesUIProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const setSelectedBranch = useBranchStore((state) => state.setSelectedBranch)
  const companyId = branchUsers[0].Branch.companyId;

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
      {
        openModal === 'branch' && (
          <Modal>
            <BranchForm
              currentRow={null}
              companyId={companyId}
              handleCloseForm={closeModal}
            />
          </Modal>
        )
      }
      {
        openModal === 'cashRegister' && (
          <Modal>
            <CashRegisterForm
              currentRow={null}
              handleCloseForm={closeModal}
            />
          </Modal>
        )
      }
      
      
    </section>
  );
};
