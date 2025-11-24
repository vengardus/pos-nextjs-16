"use cache";

import "server-only";

import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { branchGetAllByCompany } from "@/actions/branches/querys/branch.get-all-by-company.action";

export const branchGetAllByCompanyCachedOld = async (
  companyId: string
): Promise<ResponseAction> => {
  cacheTag(`branches-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return branchGetAllByCompany(companyId);
};

export async function branchGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-branchGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return branchGetAllByCompany(companyId);
    },
    [`branches-${companyId}`],
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
