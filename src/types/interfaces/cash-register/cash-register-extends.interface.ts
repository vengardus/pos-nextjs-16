import { CashRegister } from "./cash-register.interface";

export interface CashRegisterExtends extends CashRegister {
  branchName: string
  //status: string
}
