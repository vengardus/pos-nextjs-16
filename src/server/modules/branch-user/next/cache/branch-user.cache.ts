//"use cache";

import "server-only";

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { branchUserGetAllByUserUseCase } from "@/server/modules/branch-user/use-cases/branch-user.get-all-by-user.use-case";

// export const branchUserGetAllByUserCachedOld = async (userId: string): Promise<ResponseAction> => {
//   cacheTag(`branches-${userId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await branchUserGetAllByUser(userId);
// };

export async function branchUserGetAllByUserCached(userId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>branchUserGetAllByUserCached");
  const fn = cache(
    async () => {
      return branchUserGetAllByUserUseCase(userId);
    },
    [`branches-${userId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`branches-${userId}`],
    }
  );
  return fn();
}
