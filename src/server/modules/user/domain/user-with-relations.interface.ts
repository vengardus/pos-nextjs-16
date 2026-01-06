import type { BranchUser } from "@/server/modules/branch-user/domain/branch-user.interface";
import type { CashRegisterMovement } from "@/server/modules/cash-register-movement/domain/cash-register-movement.interface";
import type { Company } from "@/server/modules/company/domain/company.interface";
import type { Sale } from "@/server/modules/sale/domain/sale.interface";
import type { User } from "./user.interface";

export interface UserWithRelations extends User {
  Company?: Company[];
  Sale?: Sale[];
  CashRegisterMovement?: CashRegisterMovement[]
  BranchUser?: BranchUser[]
}
