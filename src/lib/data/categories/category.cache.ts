"use cache";

import "server-only";
// import {
//   cacheLife,
//   cacheTag,
// } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { categoryGetAllByCompany } from "./category.get-all-by-company";

// export const categoryGetAllByCompanyCachedOld = async (companyId: string): Promise<ResponseAction> => {
//   "use cache";
//   cacheTag(`categories-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await categoryGetAllByCompany(companyId);
// };

export async function categoryGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>categoryGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return categoryGetAllByCompany(companyId);
    },
    [`categories-${companyId}`],
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
