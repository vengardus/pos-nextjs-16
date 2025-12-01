//"use cache";

import 'server-only'

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
//import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { branchUserGetAllByUser } from "./branch-user.get-all-by-user";

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
      return branchUserGetAllByUser(userId);
    },
    [`branches-${userId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`branches-${userId}`],
    }
  );
  return fn();
}
