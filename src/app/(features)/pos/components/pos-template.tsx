"use client";

import { useEffect, useState } from "react";

import type { Company } from "@/types/interfaces/company/company.interface";
import type { CashRegisterDecision } from "@/server/modules/cash-register/domain/cash-register.types";
import { useCompanyStore } from "@/stores/company/company.store";
import { useCartStore } from "@/stores/cart/cart.store";
import { useUserStore } from "@/stores/user/user.store";
import { useCashRegisterDecisionStore } from "@/stores/cash-register/cash-register-decision.store";
import { PosPayment } from "./pos-payment";
import { PosTicketModal } from "./pos-ticket-modal";
import { Modal } from "@/components/common/modals/modal";
import { OpenCashRegister } from "./open-cash-register/open-cash-register";

interface PosTemplateProps {
  data: {
    branchId: string;
    company: Company;
    cashRegisterClosureId?: string;
    currentUser: {
      id: string;
      userName: string;
      role: string;
    };
    cashRegisterDecision: CashRegisterDecision;
  };
}
export const PosTemplate = ({ data }: PosTemplateProps) => {
  const { branchId, company, currentUser, cashRegisterDecision } = data;
  const setBranchId = useCartStore((state) => state.setBranchId);
  const setCompany = useCompanyStore((state) => state.setCompany);
  const getSummaryCart = useCartStore((state) => state.getSummaryCart);
  const [isLoading, setIsLoading] = useState(true);
  const isOpenModalSalePayment = useCartStore((state) => state.isOpenModalSalePayment);
  const setIsOpenModalSalePayment = useCartStore((state) => state.setIsOpenModalSalePayment);
  const isOpenTicketModal = useCartStore((state) => state.isOpenTicketModal);
  const setIsOpenTicketModal = useCartStore((state) => state.setIsOpenTicketModal);
  const setCashRegisterOpen = useCartStore((state) => state.setCashRegisterOpen);

  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const [isOpenedCashRegister, setIsOpenedCashRegister] = useState(false);

  const setCashRegisterDecision = useCashRegisterDecisionStore(
    (state) => state.setCashRegisterDecision
  );

  useEffect(() => {
    if (branchId) setBranchId(branchId);
    if (company) setCompany(company);
    if (currentUser) setCurrentUser(currentUser);
    if (cashRegisterDecision) {
      setCashRegisterDecision(cashRegisterDecision);
    }

    setIsLoading(false);
  }, [
    branchId,
    company,
    currentUser,
    cashRegisterDecision,
    setBranchId,
    setCompany,
    setCurrentUser,
    setCashRegisterDecision,
    setIsLoading,
  ]);

  useEffect(() => {
    console.log("↪ PosTemplate-MSG second effect!!!!:", cashRegisterDecision);
    const { type, cashRegisterClosureId, cashRegisters } = cashRegisterDecision;
    if (type == "existing") {
      setCashRegisterOpen({
        ...cashRegisters[0],
        cashRegisterClosureId: cashRegisterClosureId!,
      });
      setIsOpenedCashRegister(true);
    } else setIsOpenedCashRegister(false);
  }, [cashRegisterDecision, setCashRegisterOpen, setIsOpenedCashRegister]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...{cashRegisterDecision.type}</p>
      </div>
    );
  }

  return (
    <>
      {isOpenModalSalePayment && getSummaryCart().total > 0 && (
        <PosPayment handleCloseModal={setIsOpenModalSalePayment} />
      )}

      {isOpenTicketModal && <PosTicketModal handleCloseModal={setIsOpenTicketModal} />}

      {!isOpenedCashRegister && (
        <Modal >
          <OpenCashRegister
            isOpenOpenRegisterModal={!isOpenedCashRegister}
          />
        </Modal>
      )}
    </>
  );
};
