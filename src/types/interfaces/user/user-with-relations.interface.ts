import type { BranchUser } from "../branch-user/branch-user.interface";
import type { CashRegisterMovement } from "../cash-register-movement/cash-register-movement.interface";
import type { Company } from "../company/company.interface";
import type { Sale } from "../sales/sale.interface";
import type { User } from "./user.interface";

export interface UserWithRelations extends User {
  Company?: Company[];
  Sale?: Sale[];
  CashRegisterMovement?: CashRegisterMovement[]
  BranchUser?: BranchUser[]
}
