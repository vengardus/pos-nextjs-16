"use cache";

import 'server-only'

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cacheLife, cacheTag } from "next/cache";
import { cashRegisterGetByBranch } from "./cash-register.get-by-branch";
import { cashRegisterDetermineActiveCashRegister } from "./cash-register.determine-active-cash-register";

export const cashRegisterGetByBranchCached = async (
  branchId: string,
  companyId: string
): Promise<ResponseAction> => {
  cacheTag(`cash-register-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await cashRegisterGetByBranch(branchId);
};

export const cashRegisterDetermineActiveCashRegisterCached = async (
  userId: string,
  branchId: string
): Promise<ResponseAction> => {
  cacheTag(`cash-register-determine-active-${userId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await cashRegisterDetermineActiveCashRegister({
    userId,
    branchId,
  });
};

//-----

// export async function cashRegisterGetByBranchCached(
//   branchId: string,
//   companyId: string): Promise<ResponseAction> {
//   // Aquí companyId está en scope, así que podemos usarlo en keyParts
//   console.log("pre-cashRegisterGetByBranchCached");
//   const fn = cache(
//     async () => {
//       return cashRegisterGetByBranch(branchId);
//     },
//     [`cash-register-${companyId}`],
//     { revalidate: CacheConfig.CacheDurations.revalidate }
//   );
//   return fn();
// }

// export async function cashRegisterDetermineActiveCashRegisterCached(
//   userId: string,
//   branchId: string): Promise<ResponseAction> {
//   // Aquí companyId está en scope, así que podemos usarlo en keyParts
//   console.log("pre", `cash-register-determine-active-${userId}`);
//   const fn = cache(
//     async () => {
//       return cashRegisterDetermineActiveCashRegister({
//         userId,
//         branchId,
//       });
//     },
//     [`cash-register-determine-active-${userId}`],
//     { revalidate: CacheConfig.CacheDurations.revalidate }
//   );
//   return fn();
// }
