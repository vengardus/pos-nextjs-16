import "server-only";

import { unstable_cache as cache } from "next/cache";
import { CacheConfig } from "@/server/next/cache.config";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { cashRegisterClosureGetByStatusUseCase } from "../../use-cases/cash-register-closure.get-by-status.use-case";
import { cashRegisterClosureGetByIdUseCase } from "../../use-cases/cash-register-closure.get-by-id.use-case";

export async function cashRegisterClosureGetByCashRegisterStatusCached(
  cashRegisterId: string
): Promise<ResponseAction> {
  console.log("cache=>cashRegisterClosureGetByCashRegisterStatusCached");
  const fn = cache(
    async () => {
      return cashRegisterClosureGetByStatusUseCase(
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
  console.log("cache=>cashRegisterClosureGetByIdCached");
  const fn = cache(
    async () => {
      return cashRegisterClosureGetByIdUseCase(cashRegisterClosureId);
    },
    [`cash-register-closure-${cashRegisterClosureId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`cash-register-closure-${cashRegisterClosureId}`],
    }
  );
  return fn();
}
