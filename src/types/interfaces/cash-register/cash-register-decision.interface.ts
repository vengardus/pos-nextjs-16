import type { CashRegisterExtends } from "./cash-register-extends.interface";

export interface CashRegisterDecision {
  type: "existing" | "selection";
  cashRegisterClosureId?: string;   // si type = "existing"
  cashRegisters: CashRegisterExtends[];
}
