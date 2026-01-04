export enum CashRegisterStatusEnum {
  OPENING = "OPENING",
  CLOSING = "CLOSING",
}

export interface CashRegister {
  id: string;
  description: string;
  isDefault: boolean;
  branchId: string;
}

export interface CashRegisterExtends extends CashRegister {
  branchName: string;
}

export interface CashRegisterOpen extends CashRegisterExtends {
  cashRegisterClosureId: string;
}

export interface CashRegisterDecision {
  type: "existing" | "selection";
  cashRegisterClosureId?: string; // si type = "existing"
  cashRegisters: CashRegisterExtends[];
}
