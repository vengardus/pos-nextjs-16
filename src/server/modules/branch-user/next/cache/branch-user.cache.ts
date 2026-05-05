//"use cache";

import "server-only";

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { branchUserGetAllByUserUseCase } from "@/server/modules/branch-user/use-cases/branch-user.get-all-by-user.use-case";
import { branchUserCacheTag } from "./branch-user.tags";

export async function branchUserGetAllByUserCached(
  userId: string,
  page?: number,
  pageSize?: number,
  search?: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>branchUserGetAllByUserCached");
  const fn = cache(
    async () => {
      return branchUserGetAllByUserUseCase(userId, page, pageSize, search);
    },
    [`branches-${userId}-${page}-${pageSize}-${search}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [branchUserCacheTag(userId)],
    }
  );
  return fn();
}
