import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";
import { CacheConfig } from "@/config/cache.config";
import { CashRegisterStatusEnum } from "@/types/enums/cash-register-status.enum";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cashRegisterClosureGetByCashRegisterStatus } from "../querys/cash-register-closure.get-by-cash-register-status.action";
import { cashRegisterClosureGetById } from "../querys/cash-register-closure.get-by-id";

export const cashRegisterClosureGetByCashRegisterStatusCachedOld = async (
  cashRegisterId: string
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`cash-register-closure-${cashRegisterId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await cashRegisterClosureGetByCashRegisterStatus(
    cashRegisterId,
    CashRegisterStatusEnum.OPENING
  );
};

export const cashRegisterClosureGetByIdCachedOld = async (
  cashRegisterClosureId: string
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`cash-register-closure-${cashRegisterClosureId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await cashRegisterClosureGetById(cashRegisterClosureId);
};

//-------

export async function cashRegisterClosureGetByCashRegisterStatusCached(cashRegisterId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-cashRegisterClosureGetByCashRegisterStatusCached");
  const fn = cache(
    async () => {
      return cashRegisterClosureGetByCashRegisterStatus(
        cashRegisterId,
        CashRegisterStatusEnum.OPENING
      );
    },
    [`cash-register-closure-${cashRegisterId}`], 
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}

export async function cashRegisterClosureGetByIdCached(  cashRegisterClosureId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre", `cash-register-closure-${cashRegisterClosureId}`);
  const fn = cache(
    async () => {
      return cashRegisterClosureGetById(cashRegisterClosureId);
    },
    [`cash-register-closure-${cashRegisterClosureId}`], 
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
