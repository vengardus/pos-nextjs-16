import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CashRegister } from "@/server/modules/cash-register/domain/cash-register.types";

interface State {
  cashRegister: CashRegister;             // usada en el post
  setCashRegister: (cashRegister: CashRegister) => void;
  selectedCashRegister: CashRegister | null
  setSelectedCashRegister: (cashRegister: CashRegister | null) => void
}

export const useCashRegisterStore = create<State>()(
  persist(
    (set) => ({
      cashRegister: {} as CashRegister,

      setCashRegister: (cashRegister: CashRegister) => {
        set({ cashRegister });
      },

      selectedCashRegister: null,

      setSelectedCashRegister: (cashRegister: CashRegister | null) => {
        console.log("cashRegister.store:setSelectedCashRegister", cashRegister);
        set({ selectedCashRegister: cashRegister });
      },

    }),
    {
      name: "cashRegister-store",
    }
  )
);
