// "use cache";
import "server-only";

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cashRegisterClosureGetByCashRegisterStatus } from "./cash-register-closure.get-by-cash-register-status";
import { cashRegisterClosureGetById } from "./cash-register-closure.get-by-id";

// export const cashRegisterClosureGetByCashRegisterStatusCachedOld = async (
//   cashRegisterId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`cash-register-closure-${cashRegisterId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await cashRegisterClosureGetByCashRegisterStatus(
//     cashRegisterId,
//     CashRegisterStatusEnum.OPENING
//   );
// };

// export const cashRegisterClosureGetByIdCachedOld = async (
//   cashRegisterClosureId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`cash-register-closure-${cashRegisterClosureId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await cashRegisterClosureGetById(cashRegisterClosureId);
// };

//-------
export async function cashRegisterClosureGetByCashRegisterStatusCached(
  cashRegisterId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>cashRegisterClosureGetByCashRegisterStatusCached");
  const fn = cache(
    async () => {
      return cashRegisterClosureGetByCashRegisterStatus(
        cashRegisterId,
        CashRegisterStatusEnum.OPENING
      );
    },
    [`cash-register-closure-${cashRegisterId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`cash-register-closure-${cashRegisterId}`],
    }
  );
  return fn();
}

export async function cashRegisterClosureGetByIdCached(
  cashRegisterClosureId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>cashRegisterClosureGetByIdCached");
  const fn = cache(
    async () => {
      return cashRegisterClosureGetById(cashRegisterClosureId);
    },
    [`cash-register-closure-${cashRegisterClosureId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`cash-register-closure-${cashRegisterClosureId}`],
    }
  );
  return fn();
}
