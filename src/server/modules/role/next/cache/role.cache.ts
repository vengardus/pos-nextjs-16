// "use cache";

import "server-only";

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { roleGetAllByCompanyUseCase } from "@/server/modules/role/use-cases/role.get-all-by-company.use-case";
import { roleCacheTag } from "./role.tags";

export async function roleGetAllByCompanyCached(
  companyId: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>roleGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return roleGetAllByCompanyUseCase(companyId, page, limit, search);
    },
    [`roles-${companyId}-${page}-${limit}-${search}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [roleCacheTag(companyId)],
    }
  );
  return fn();
}
