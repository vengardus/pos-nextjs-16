import { CashRegisterDecision } from "@/types/interfaces/cash-register/cash-register-decision.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cashRegisterDecision: CashRegisterDecision;
  setCashRegisterDecision: (cashRegisterDecision: CashRegisterDecision) => void;
}

export const useCashRegisterDecisionStore = create<State>()(
  persist(
    (set) => ({
      cashRegisterDecision: {} as CashRegisterDecision,
      setCashRegisterDecision: (cashRegisterDecision: CashRegisterDecision) => {
        set({ cashRegisterDecision });
      },
    }),
    {
      name: "cash-register-decision1",
    }
  )
);
