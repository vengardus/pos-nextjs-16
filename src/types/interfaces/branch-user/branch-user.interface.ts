import { Branch } from "../branch/branch.interface";

export interface BranchUser {
  id: string;
  userId: string;
  branchId: string;
  cashRegisterId: string;
  Branch: Branch;
}
