// "use cache";

import 'server-only'

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { branchGetAllByCompany } from "./branch.get-all-by-company";

// export const branchGetAllByCompanyCachedOld = async (companyId: string): Promise<ResponseAction> => {
//   cacheTag(`branches-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await branchGetAllByCompany(companyId);
// };

export async function branchGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>branchGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return branchGetAllByCompany(companyId);
    },
    [`branches-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`branches-${companyId}`],
    }
  );
  return fn();
}
