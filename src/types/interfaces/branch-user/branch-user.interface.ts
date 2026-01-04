import { Branch } from "@/server/modules/branch/domain/branch.types";

export interface BranchUser {
  id: string;
  userId: string;
  branchId: string;
  cashRegisterId: string;
  Branch: Branch;
}
