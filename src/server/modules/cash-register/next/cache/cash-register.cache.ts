//"use cache";

import 'server-only'

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { unstable_cache as cache } from "next/cache";
import { cashRegisterGetByBranchRepository } from "../../repository/cash-register.get-by-branch.repository";
import { cashRegisterDetermineActiveUseCase } from "../../use-cases/cash-register.determine-active.use-case";

export async function cashRegisterGetByBranchCached(
  branchId: string,
  companyId: string): Promise<ResponseAction> {
  console.log("cache=>cashRegisterGetByBranchCached");
  const fn = cache(
    async () => {
      return cashRegisterGetByBranchRepository(branchId);
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
  // y el resultado depende tanto del usuario como de la sucursal.
  console.log("nocache=>cashRegisterDetermineActiveCashRegisterCached");
  return cashRegisterDetermineActiveUseCase({
    userId,
    branchId,
  });
}
