//"use cache";

import 'server-only'

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { cashRegisterGetByBranch } from "./cash-register.get-by-branch";
import { cashRegisterDetermineActiveCashRegister } from "./cash-register.determine-active-cash-register";

// export const cashRegisterGetByBranchCachedOld = async (
//   branchId: string,
//   companyId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`cash-register-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await cashRegisterGetByBranch(branchId);
// };

// export const cashRegisterDetermineActiveCashRegisterCachedOld = async (
//   userId: string,
//   branchId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`cash-register-determine-active-${userId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await cashRegisterDetermineActiveCashRegister({
//     userId,
//     branchId,
//   });
// };

//-----

export async function cashRegisterGetByBranchCached(
  branchId: string,
  companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>cashRegisterGetByBranchCached");
  const fn = cache(
    async () => {
      return cashRegisterGetByBranch(branchId);
    },
    [`cash-register-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`cash-register-${companyId}`],
    }
  );
  return fn();
}

export async function cashRegisterDetermineActiveCashRegisterCached(
  userId: string,
  branchId: string
): Promise<ResponseAction> {
  // No se debe usar caché aquí porque las cajas abiertas cambian minuto a minuto
  // y el resultado depende tanto del usuario como de la sucursal. Mantener cacheado
  // provoca que el usuario vea una lista vacía aun cuando se asignó una caja
  // posteriormente.
  console.log("nocache=>cashRegisterDetermineActiveCashRegisterCached");
  return cashRegisterDetermineActiveCashRegister({
    userId,
    branchId,
  });
}
